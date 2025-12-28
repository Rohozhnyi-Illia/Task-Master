const parseError = (error) => {
  const message =
    error.response?.data?.error || error.response?.data?.message || error.message || 'Error'

  return message
}

export default parseError
