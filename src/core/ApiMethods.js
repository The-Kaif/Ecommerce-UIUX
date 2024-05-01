/**
 * Make this function for calling the API
 * @param method Method: 'GET', 'POST', 'PUT', or 'DELETE'
 * @param endPoint Endpoint URL
 * @param payload Payload data for POST and PUT requests
 * @returns Promise
 */
function callApi(method, endPoint, payload = {}) {
    const headers = new Headers();

    const requestOptions = {
        method: method,
        headers: headers
    };
    console.log("process.env.REACT_APP_END_POINT",process.env.REACT_APP_END_POINT)
    if (method === 'POST' || method === 'PUT') {
        headers.set('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(payload);
    } else if (method === 'GET') {
        const url = new URL(`${process.env.REACT_APP_END_POINT}${endPoint}`);
        if (payload) {
            Object.keys(payload).forEach(key =>
                url.searchParams.append(key, payload[key])
            );
        }
        
        endPoint = url.toString();
    }

    const hitUrl = method === "GET" ? endPoint : `${process.env.REACT_APP_END_POINT}${endPoint}`;

    return fetch(hitUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .catch(error => {
            return { message: error.message };
        });
}

export default callApi