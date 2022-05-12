export const http = async (url, method = 'GET', body = null, headers = {}) => {
    return await new Promise(async (resolve, reject) => {
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
    
            const response = await fetch(url, { method, body, headers })
            const data = await response.json()
    
            if (!response.ok) {
                reject(new Error(data.message || 'Something went wrong'))
            }
    
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}