package cecohort

import "testing"

func TestLabel(t *testing.T) {
	cases := []struct {
		code string
		want string
		ok   bool
	}{
		{"64200002", "CE01", true},
		{"65200006", "CE02", true},
		{"66200004", "CE03", true},
		{"67200014", "CE04", true},
		{"68200001", "CE05", true},
		{"", "", false},
		{"abc", "", false},
		{"63200001", "", false}, // ก่อนรุ่นแรก
	}
	for _, tc := range cases {
		got, ok := Label(tc.code)
		if ok != tc.ok || got != tc.want {
			t.Fatalf("Label(%q)=%q,%v want %q,%v", tc.code, got, ok, tc.want, tc.ok)
		}
	}
}
