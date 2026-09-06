package dto

type PresignUploadRequest struct {
	Filename    string `json:"filename" binding:"required"`
	ContentType string `json:"content_type" binding:"required"`
	Kind        string `json:"kind"` // image | video | pdf | file
}

type PresignUploadResponse struct {
	Key         string `json:"key"`
	UploadURL   string `json:"upload_url"`
	FileURL     string `json:"file_url"`
	ContentType string `json:"content_type"`
	ExpiresIn   int    `json:"expires_in_seconds"`
}

type DirectUploadResponse struct {
	Key         string `json:"key"`
	FileURL     string `json:"file_url"`
	ContentType string `json:"content_type"`
}

type DeleteUploadRequest struct {
	Key     string `json:"key"`      // uploads/image/...
	FileURL string `json:"file_url"` // หรือส่ง URL เต็มก็ได้
}

type DeleteUploadResponse struct {
	Key     string `json:"key"`
	Deleted bool   `json:"deleted"`
}
