class ApiError extends Error {
  statusCode: number
  statusName: string

  constructor(message: string, statusCode: number, statusName: string) {
    super(message)
    this.statusCode = statusCode
    this.statusName = statusName
  }
}

export default ApiError
