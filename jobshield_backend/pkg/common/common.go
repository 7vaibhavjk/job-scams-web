package common

const (
	NginxConfigPath   = "/etc/openresty/nginx.conf"
	NginxLinkDataPath = "/var/log/openresty/error.log"
)

const (
	NormalStatus  = "normal"
	WarningStatus = "warning"
	DeletedStatus = "deleted"
)

const (
	UnableLinkStatus  = "unable"
	EnableLinkStatus  = "enable"
	DeletedLinkStatus = "deleted"
	ForbiddenStatus   = "forbidden"
)

const (
	UrlSafety  = "safety"
	UrlDanger  = "danger"
	UrlUnknown = "unknown"
)

const (
	UrlSourceKaggle  = "source_kaggle"
	UrlSourceUrlhaus = "source_urlhaus"
)

const (
	ReporterWebUser = "web_user"
)
