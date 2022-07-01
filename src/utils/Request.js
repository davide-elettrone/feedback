export default class Request{
    static domain = 'https://localhost:7252/';

    static async get(url, payload){
        payload = JSON.stringify(payload);

        const response = await fetch(
            Request.domain + url,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: payload
            }
        );

        if(!response.ok) throw response;

        const text = await response.text();

        try {
            const json = JSON.parse(text);
            return json;
        } catch (error) {
            return text;
        }
    }

    static async post(url, payload){
        payload = JSON.stringify(payload);

        const response = await fetch(
            Request.domain + url,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: payload
            }
        );

        if(!response.ok) throw response;

        const text = await response.text();

        try {
            const json = JSON.parse(text);
            return json;
        } catch (error) {
            return text;
        }
    }

    static async delete(url, payload){
        payload = JSON.stringify(payload);
        
        const response = await fetch(
            Request.domain + url,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: payload
            }
        );

        if(!response.ok) throw response;

        const text = await response.text();

        try {
            const json = JSON.parse(text);
            return json;
        } catch (error) {
            return text;
        }
    }
}