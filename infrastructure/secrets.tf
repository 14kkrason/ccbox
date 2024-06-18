data "aws_ssm_parameter" "db_user" {
  name = "db_user"
}

data "aws_ssm_parameter" "db_password" {
  name = "db_password"
}

variable "db_user" {
  description = "RDS database user"
  default = data.aws_ssm_parameter.db_user.value
}

variable "db_password" {
  description = "RDS database password"
  default = data.aws_ssm_parameter.db_password.value
}
