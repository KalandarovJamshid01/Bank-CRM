module.exports = (req, res, statusCode, data, count) => {
  let page = req?.query?.page || 1;
  let limit = req.query?.limit * 1 || count;

  let pageCount;

  pageCount = Math.ceil(count / limit);

  if (Array.isArray(data)) {
    res.status(statusCode).json({
      status: 'Success',
      limit: limit,
      currentPage: page,
      pageCount: pageCount,
      totalCount: count,
      data: data,
    });
  } else {
    res.status(statusCode).json({
      status: 'Success',
      data: data,
    });
  }
};
