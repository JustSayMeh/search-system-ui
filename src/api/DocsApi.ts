export class DocsApi {
    getDomains = () => {
        return fetch("/docs/domains", {
            method: 'GET'
        }).then(response => {
            if (response.status == 401)
                return Promise.reject("unauthorized").then(v => v)
            if (response.status == 403)
                return Promise.reject("forbidden").then(v => v)
            return response.json().then(value => value as Array<String>);
        })
    }

    getDocsTree = () => {
        return fetch("/docs/domains/tree", {
            method: 'GET'
        }).then(response => {
            if (response.status == 401)
                return Promise.reject("unauthorized").then(v => v)
            if (response.status == 403)
                return Promise.reject("forbidden").then(v => v)
            return response.json().then(value => value as Map<String, Array<String>>);
        })
    }

    deleteDoc = (domain: String, filename: String) => {
        return fetch("/docs/" + domain + "/" + filename, {
            method: 'DELETE'
        }).then(response => {
            if (response.status == 401)
                return Promise.reject("unauthorized").then(v => v)
            if (response.status == 403)
                return Promise.reject("forbidden").then(v => v)
            return response.text().then(value => value);
        })
    }

    uploadFile = (domain: String, filename: String, body: FormData) => {
        return fetch("/docs/" + domain + "/" + filename, {
            method: 'POST',
            body: body
        }).then(response => {
            if (response.status == 401)
                return Promise.reject("unauthorized").then(v => v)
            if (response.status == 403)
                return Promise.reject("forbidden").then(v => v)
            return response.json().then(value => value as Array<String>);
        })
    }
}