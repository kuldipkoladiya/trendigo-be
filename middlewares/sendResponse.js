function sendResponse(req, res, next) {
  const response = res.send;
  res.send = function (...args) {
    const originalData = args[0];
    const newArgs = [...args];
    if (originalData && originalData.error) {
      newArgs[0] = {
        status: 'Failure',
        code: originalData.code,
        message: originalData.message,
        stack: originalData.stack,
      };
    } else if (originalData && originalData.results) {
      const { results, ...otherFields } = originalData;
      newArgs[0] = { status: 'Success', data: results, ...otherFields };
    }
    response.apply(res, newArgs);
  };
  next();
}
export default sendResponse;
