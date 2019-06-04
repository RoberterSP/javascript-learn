export const creatPromise = (url, params) => {
    return new Promise(function (resolve, reject) {
        axios.post(url, params).then((res) => {
                resolve(res)
            }).catch((err) => {
            reject(err)
        })
    })
  }