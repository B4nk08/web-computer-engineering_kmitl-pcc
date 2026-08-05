package s3x

import (
	"context"
	"fmt"
	"path"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type Config struct {
	Region          string
	Bucket          string
	AccessKeyID     string
	SecretAccessKey string
	PublicBaseURL   string // optional CloudFront / custom domain
	Endpoint        string // optional MinIO / LocalStack
}

type Client struct {
	bucket        string
	publicBaseURL string
	region        string
	presign       *s3.PresignClient
	raw           *s3.Client
}

func New(ctx context.Context, cfg Config) (*Client, error) {
	if cfg.Bucket == "" || cfg.Region == "" {
		return nil, fmt.Errorf("AWS_S3_BUCKET and AWS_REGION are required")
	}
	if cfg.AccessKeyID == "" || cfg.SecretAccessKey == "" {
		return nil, fmt.Errorf("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required")
	}

	loadOpts := []func(*awsconfig.LoadOptions) error{
		awsconfig.WithRegion(cfg.Region),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AccessKeyID,
			cfg.SecretAccessKey,
			"",
		)),
	}

	awsCfg, err := awsconfig.LoadDefaultConfig(ctx, loadOpts...)
	if err != nil {
		return nil, err
	}

	s3Opts := []func(*s3.Options){}
	if cfg.Endpoint != "" {
		s3Opts = append(s3Opts, func(o *s3.Options) {
			o.BaseEndpoint = aws.String(cfg.Endpoint)
			o.UsePathStyle = true
		})
	}

	raw := s3.NewFromConfig(awsCfg, s3Opts...)
	return &Client{
		bucket:        cfg.Bucket,
		publicBaseURL: strings.TrimRight(cfg.PublicBaseURL, "/"),
		region:        cfg.Region,
		presign:       s3.NewPresignClient(raw),
		raw:           raw,
	}, nil
}

type PresignPutResult struct {
	Key       string
	UploadURL string
	FileURL   string
	ExpiresIn time.Duration
}

func (c *Client) PresignPut(ctx context.Context, kind, filename, contentType string, expires time.Duration) (*PresignPutResult, error) {
	key := buildObjectKey(kind, filename)
	out, err := c.presign.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(c.bucket),
		Key:         aws.String(key),
		ContentType: aws.String(contentType),
	}, s3.WithPresignExpires(expires))
	if err != nil {
		return nil, err
	}
	return &PresignPutResult{
		Key:       key,
		UploadURL: out.URL,
		FileURL:   c.publicURL(key),
		ExpiresIn: expires,
	}, nil
}

func (c *Client) publicURL(key string) string {
	if c.publicBaseURL != "" {
		return c.publicBaseURL + "/" + strings.TrimLeft(key, "/")
	}
	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", c.bucket, c.region, key)
}

func buildObjectKey(kind, filename string) string {
	now := time.Now().UTC()
	safe := sanitizeFilename(filename)
	return path.Join(
		"uploads",
		kind,
		fmt.Sprintf("%04d", now.Year()),
		fmt.Sprintf("%02d", now.Month()),
		fmt.Sprintf("%s-%s", uuid.NewString(), safe),
	)
}

func sanitizeFilename(name string) string {
	name = path.Base(strings.TrimSpace(name))
	name = strings.ReplaceAll(name, " ", "-")
	var b strings.Builder
	for _, r := range name {
		if (r >= 'a' && r <= 'z') ||
			(r >= 'A' && r <= 'Z') ||
			(r >= '0' && r <= '9') ||
			r == '.' || r == '-' || r == '_' {
			b.WriteRune(r)
		}
	}
	out := b.String()
	if out == "" || out == "." {
		return "file"
	}
	if len(out) > 80 {
		out = out[len(out)-80:]
	}
	return out
}
