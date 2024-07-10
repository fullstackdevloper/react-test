

export async function successResponseWithMessage(res, success, msg) {
  return res.json(
    {
    
      statusCode: 200,
      success,
      message: msg,
    },
    {
      status: 200,
    }
  );
}

export async function successResponseWithData(
  res,
  success,
  message,
  data = {}
) {
  return res.json(
    {
      message,
      statusCode: 200,
      success,
      data,
    },
    {
      status: 200,
    }
  );
}

export async function unauthorizedError(res, message) {
  return (
    res.json({
      message,
      success,
      statusCode: 401,
    }),
    {
      status: 401,
    }
  );
}

export async function badRequest(res, message) {
  return res.json(
    {
      message,
      statusCode: 400,
      status:false
    },
    {
      status: 400,
    }
  );
}

export async function serverError(res, message) {
  message = message ? message : "INTERNAL SERVER ERROR"
  return res.json(
    {
      message,
      status: 500,
    },
    {
      status: 500,
    }
  );
}
