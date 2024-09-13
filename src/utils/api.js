//* custom fetch Api 
const useApi = async (method, url, data={}) => {
  //~ checks before fetching
  if (url.trim()==='') {
    return new Error("url cannot be empty...");
  } else if (method.trim()==='') {
    return new Error("method cannot be empty...");
  }

  method = method.toUpperCase();

  //~ headers
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  //~ base url
  const baseurl = "https://frontendassignment-algo-one.netlify.app";

  try {
    let options = { method, headers };
    if (method!=='GET' && method!=='HEAD') 
      options.body = JSON.stringify(data);
    options = await requestInterceptor(options);

    //* sending request
    const response = await fetch(baseurl+url, options); 
    const result = await responseInterceptor(response);
    return result;
  } catch (error) {
    console.error("An Error occured at useApi: ", error.message);
    throw error;
  }
};

//* Request Interceptor
const requestInterceptor = async (options) => {
  return {
    ...options,
    headers: {
      ...options.headers,
      //~ additional headers can be added as token or etc.
    },
  };
};

//* Response Inteceptor
const responseInterceptor = async (response) => {
  const data = await response.json();
  return {
    data,
    status: response.status,
    url: response.url,
    statusText: response.statusText
  };
};

//* exports
export default useApi;


