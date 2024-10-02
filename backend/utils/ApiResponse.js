function ApiResponse(res, status, message, data = null) {
    const response = {
      status,
      message,
    };
  
    if (data) {
      response.data = data;
    }
  
    return res.status(status).json(response);
  }
  
  export default ApiResponse;