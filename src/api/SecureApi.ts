import {ICsrfToken} from "./interfaces/ICsrfToken";

export class SecureApi {

    getCsrfToken = () => {
        return fetch("/security/csrfToken", {
            method: 'GET'
        }).then(response => {
            if (response.status == 401)
                return Promise.reject("unauthorized");
            if (response.status == 403)
                return Promise.reject("forbidden");
            return response.json().then(value => value as ICsrfToken);
        })
    }

    login = (formData: FormData) => {
        return fetch("/login", {
            method: 'POST',
            body: formData
        }).then(response => {
          if (response.ok) {
              return response.text();
          }
          return Promise.reject("Неверное имя пользователя или пароль!");
        })
    }

    logout = () => {
        return fetch("/logout", {
            method: 'POST'
        }).then(value => value.text());
    }
}