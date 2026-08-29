document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. STATE & CONSTANTS
    // -------------------------------------------------------------
    // SHA-256 Hash of your secret PIN (e.g., "120498")
    const ENTRY_PIN_HASH = "63cf52215b7514d8dcdc9bfabd47aef052acce6dbc732367e4e0d97c8c2ad01a";

    // In-memory key holder (never saved to source code)
    let userSecretKey = "";
    let isChecking = false;

    // Encrypted payloads mapped to section selectors and target element IDs
    const ENCRYPTED_MESSAGES = {
        '#message-section': [
            { id: 'message-title', data: '{"iv":"i+YJ+9GjrD97OA88","data":"5NRA9Y7hPlO5ko8CWIDlFfTi+Wqo7V3fV4jfSjeA4YhuwRHPe8g5eb/MJg=="}' },
            { id: 'wish-message', data: '{"iv": "zVij2lYH3cGyfSyh", "data": "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"}' }
        ],
        '#view-gifts-content': [
            { id: 'card1-title', data: '{"iv":"meimDKlLI/gVnTUm","data":"O8j3SxxUmE5G/5rs6DYodSdyEk+EUZd03r3aOBU2APA="}' },
            { id: 'card1-sub', data: '{"iv":"y6HezsNGSYu7w0fd","data":"oqeK4kGnUCZ+JashDz7rtw2Im1QxuhMr9MpvrGEccV12iSll6Xrvx9rr147rVPXWFC6kTgzQRVuLCnVqDkzsB51Rv8OJSOGokG6jFf2OoDsUjmwU1kXOXeGduRyX5ACMlr08se4p02mNoEfFBUzoKFnAKEetKUraVCekNy2qV9+JEcUQ+3TXY1b16s/Wy3GTCgosle2PC3/BoOKoQTBggwK2HSjjTeQQSthTQIg24dW7zXsXHc9awiRH7qmdSlMTAKV71seUF2nUoBF235jGHMvk58Nch3noOlAyQEHI3k1elVYqdU09DyycI1s+Rj9+YzSEPjn7JxL2C1BGqtFhMSz1S6AuhqR621sEKPfEuk/YC83RHkOV/jBVs7QpIJcGw05myEAXmrlqxw9vQx3M4ulSLx2MgKkJarO/PReqcBqpn2QXZKWrQG1KZvDtkhOxqjexMzwPfGQDJZAoMBiEjwjf2yAbRv1XqfvBrueU2phHrS5X3ZXKAPmrggav94WjGAUtz9nIgW6Mv7fJi1RNIoatSwIzzOZ7tvsC69BSzvLNL236I6UlPBRIj/2aX6yhBsFDTMxjmYaQAWTRtV3knYwMwCCxWYHM2Qh/ZxXDttN25pv5jgTj8NG39+aVIy2qrLoHtujg/GiaChoLp37T66nHVFGxQ9a1S8eWWDQA5CK1ML793KfLq2Rxa/DES8wMjQYklsTyROd/xvgMZOxaZuq7VdN0hh+oQAfeNTAAQDh31IC/9369lgFCGJhKAY2DhbvybbqEISZtprqYZKUj1+r1Gq3YXyICnDlNu954XgoE5FUPPoOAgGGzWm4Z5p8OIhdP+gV+GIqbos4XniLPiKJZPQjc4E/Bl22st6qscAEoqEtgxdnPhzY9xnlQSDx6/tWYX60ocgg+DQQx6ho6Iu/A7zcBJlh3Cs68Ukq1jFwx2KSZOv49dpo3S6ydizT4WDxTHYUXxZjPw3sRwa3ka3ZLwJj9ZYptFFYrozf0apECPcJIu7W5bH0JffC8oZemBG2y3iz+FHBeESmJ6XrZKrFQAcJzXofDClVBfzUKt3t93G3qFLessrLciidKe3ja5cBeo+abBA3vqh/CQYIaKGWrxUB7n7GLdPZq1e8jgjfPG1TtQMM9Xi3+7jeeWM6pBa6jWZk7F2c39iJ8ImKbplwmGQMbLzSv+tOBgio99GjlTA8y923rTjmXULYQyGbqTyCb+yc5tRcU1yhYe3FRGSfMjt7Z7EQRE/DEys5Guirxg/ZAEJoAKN8jBvsBhv7tXIhx6CUw7fRP/IhWxHNbeZiauWAzQhB9SxXmZmwtSkt+0Sl+ATgVzAJM2WJtY17ACQU5s8h/T//DQlH3mCFsh89ySMwNB5hUUwmp1PAIdcz/ym4vaFZHdl26QeQWc7e6kcGXKhzvNMeLLWnjtyRCUZFraP+CKVUzEwFPl+dLDqbEkqYETebWstVZum/585D2zA/xNz3qu59sAklnMSGWiOLswXaYYhdss/BM7agras33spG5OoliBORJAwjy0TmWmNHe8gwAAIJjHqNOXorqj33tjT81DkWQY/Kegz+KEUzLkoxoqicODZQNK5jZYLEhesa9rPjx2LPWzBDx/QtzwvCWTHul2YLRiH7+hEb9tAIJvpJQN82+PXbsCnVajXVIYsTXeHcWq1eARlP4Bam6kIAOX6sMXlKSiPdJHXQRn1iWtjrTgu9pDbjyej10Y9Jv4vCxIYC2MxHwgb3Qz0QDokbVhpGpRKJa8655j82139yzQ/pNDltS7VoFsRmPTI8OITVoqS6smwUUxq5rVDEAX8xuz1blWH28KJ/m9jv5dfstHYd+NdAnulkWVDITN9oxmVf88LQvSH4xLb3x0W4SA5rDn9Jx9GeSwVfXH3QkaoofMc+lj4ADi1IGS+NxNatjiW+r2mbgWvIHd5RCRuzOJQwGD90ZpAOQR/hsKnBouBN9ZIdMwvJwx/VUv9aOWWfZUe28KQ=="}' },
            { id: 'card2-title', data: '{"iv":"Z/Muo2m1BbGPIgXe","data":"QdB/6q422pqcg8BpyuTRsyTM7hRQRN4y6MKo/8JOrfZ8gG92FVQ="}' },
            { id: 'card2-sub', data: '{"iv":"r7Gj5dBNdtZa+pz3","data":"yesJDZD1w9ie49mVyPtkgRgc9EWJVNY+Qo8LvePu2/DjBMv6eUwQmApHqBPhMnNrTQ0CyhjEMb0w+69HDDzASlkRKWZb4xVtvE8JP46waaARRSfqJG1d7kGfEqeBfo/pJbIDxcoTMxVEdaUgqnW4nMn3uElgZWn/vFle0dKWZvGEF1CeGNOuCnRw77XMi/j98Ju8psJwSS2EeRm64SSMBnZmx+JoI8s8SUnYYCtrDsDe8uYCZqZX4+rEw5t+toSXjyW3p3ma2WNuZjh1q05Lu6GLiyRbE8C8bYPphrMh00KF8epZbHiYhXsfFHDrrZTiAwxS2dRovfd6WQXQkPIPhc4e/uxtuD2zIYYR2yXYwGl2gaUheNQqhmxOb5pkhtjiBwgcMjztXNacG/d265aQQ3KwJUZ+wvj4IEb46UwufJxqzpVx2RpqdU6XpZTdv29ItVemvXIBA+9Hu92E72FR9iJkJpeeKoJEZS+YUsT4UZ41tbuSnpd63GKZyiOdBXTXYeUczOxG35Xp7UPkrTBpR67VH0vAkwwUARpW4X0mMrggOTpEMljQvWUB2X1RecTMuSB21s5MqJEB27e0cfrCdjglPEmb0+nc+31qa/QBYwAe/yUUzAT57/jD9NXMEmp4oU+mVY46jDnt1gatFD4FrO+bj2lW8g/6BBtiyjtjw9nF/7/UcR2k8DOPBt6e7hxNrmfXyNoEN+Ys72h6Ev+1Dm4xncgHg8vbqreS6osrZEKRW8JP1lCu22O+orcjhAxzDz8WD4FvlPjUwLvrUhp5F0OYaKeW7nXecd5IFJvME0d9WKTXMgBGPOkIFb2/yN+ZV+UjxQpwV7AU/Ozzacuv7YG/fmRtRtIztOqIcmZX+nOFp+r0AyilgLJOhAWs8VJLZG5QWUm9aU7FDnLExXkCBQPMdQ4qDezUBx/eUSNFP+tLsZ1s5sUVI3mvjCqrYRMu/HKSoI9n9mab1At3G6lmdxW/fVagTTcgOvgqm6PZu0FE+stGyQFouDRnf8DdjKr6Gq8rlB7HB0Y3HrCeySTmZz4q59UP7Fj205VkHG8T63QluL+pC9KxtThx"}' },
            { id: 'card3-title', data: '{"iv":"n8ztT1BP8AWeZeV3","data":"sAQ/3tITKKDKU3RdvKIKr/lURBVz3zlTIQz2Ch96OhOZgdZhUifTys69bHc="}' },
            { id: 'card3-sub', data: '{"iv":"kYFap92xi68GJo50","data":"e3WmQsbCAkcN66Yvjwjr8n0uK8OpdyogV8IY2d+RhcpU4Z3ogj6u+kqyLxSJB6irtQDJCRXqO0z3GglciAmb/JyMVaobeqNDCgwQd8kOZrLMwGsqm5nR4dPnOPPv0cfqOdOunJflf/bmPjr5p+lFguiVOVIm9fBxI+mHt7S8k2cE/XTXRte8s7zI1Tvi+PZFCg3mBufK0REPFEhoBaZkdKI3OGHLH+vpUHFZNy4IiGSCMEiDxo/Hos4fcpX+iUlisnVp+tzMWULr8vYm0GkiPBs8oRDaxFooyfv9Sw88732bdItKgeTOP1FX2WUKKGf0hjcN/kHkTrt47GgLiMu35MOdZY7WFkXJki8hhwM7iUQSxtPhkY/fwlUrGmv6cw5eIMwmMGglccYaqggG3JEjp5dcvN8Jw+26vigtmFdmEV5umVCAe1sVRvTTd6eXbYeDpNUUjQmXijtkJVervxaseHKb0MW9/EMyzKNy/FsuSz2XbNF+B3NNXJFNkvH7lmpuojjzbioMMCaklONjfD4TtY2q3FYkhEwjhAaBCI/plX1UT3GcPC3Y3XQfyg8XTvApxSeF0/kLKyE00H/6PNiYIpd8wzD4P3iqK82RQ4t4WsQgsbXJHo1ynkFFWbSJn5OHz7RnvpbGeKENl/SKSkknD8cRMbe2m1BE5ZQ16VrVfJN2OMheYkBKLvrf+enaHLaQT557IvqAkuTxkcjAhkB9DclAiZHs9P8/qsRmm3Xbi/wQzqE9uaIms6H7vYNEb//dLdlzgCm9twlnl3zNJ2SvxMPBwDN/1THjtM1Gnicwmfw0yFRJ0wOF9W/2rXHskIFjUkSz3F3fRFSg4BhydiGVzU+ffS6m2MOwXXnPXkVbBu+pJOwXlQMqL4EfJSRkVY3JlzN26YlHwJYJKCD8ZWqVle/U+gaez762CQest5dJhjT3iw6pZw6H25AyQIQZH3xezUusBs47Qy1eQOpbu0MVt95zcsOn2SxWGRTuTBS6AB3o3PvQsphpSbpSEaF4H/iB7JgAN8rdxGxJxVL5B7fCsrFEQlqicpkgE7dO2eH04C9uwkgRjY5yj2n6xobUFOoQcFJVxDL5Ait4Cnqbhbzh0T4zB+OBLH545TMjbdPZ3l90N5z3vN5PrM93bQrZIDyOFtwg7kiFOrobz0L/qhMAsENEdtSlTkKW4xRAHbL4VpE+oYPtsTxx2QJ7Yk19PjeY08UCSsbf8Npu4W7PNZVfXyivcRuxDcOU71hy8MWmKdHXMitaP8P4ciSsXQivgHhuhGusUlsiDu7iSvrLuBKxu+2eQsvo9+LtPLHYE6DCo6JuaqXMY61hQ36oQGSxdJGfXObWYam8o3JpYBELck6kitTW6x3fOAdmvvXRhMelsA71XzXJVIkjpkL8cUC9O4sIQj6EYBrT2meYS3vJb/BGbAZUZea+bCT0sAuv309h21ixFL3SehLFRhdHS8DReoGDLJo2maIHNtG62AC1Zwv0Vr3WuwH0AU+A3DBmnvmHW20gJ71VscKIk5q4LOWLUBqEpWBCNwi4PA=="}' },
            { id: 'card4-title', data: '{"iv":"AyqwuTj7ulhZI1Pm","data":"SDWn0kP0NEzzBnsfQJwjgsasIM5QGCNWeB7E"}' },
            { id: 'card4-sub', data: '{"iv":"opbmTDIFwFAVYW29","data":"gEbJdc4JLZi2pxSSdmfqYo6Fl8opKNeURdlHGUpuWXjvPZzje6/aqzMg2cFjRDk4pFOvlsyYgBlRO5/OSaaDpPMrS6LHxNHN+BQD8NHBJ0y5FERmUG4/uYFAxqCOiVSf4fnieRZOoZkafUIkZTTg7aaqRxxMFTiVh500pk08yt2L9H06qs6e1Z/52WrBCPgZTul1kMAmwHISQG9yFqAR7L7oX66o8GzdIWpdf93Z47zM9o9dR/9GYIeeYBEXIMCzLaY0OqhNAhW7Xi1q8m1M7MsKzDTt/cQwWpAfMXb+9fPOZU5Dxi1wbRZ6tjLMN56MdepdaX8oL/xUv89Tk+T9wfCXKx7cL5MbNw5qmmdflITMr16RwVXYW9IP8N9yztlZXeSHmd0evcrvZH3XYvJpDRwc9pkQIt0oL6Q5eHP7k5R/0uk="}' },
            { id: 'card5-title', data: '{"iv":"+JDb68AbGlSFb6O3","data":"P3YRKJiVGoiH9f1nnWcjP6FoADbWeTRdAPI+uUpPN0k="}' },
            { id: 'card5-sub', data: '{"iv":"OXab2MfD/ZSUnKYS","data":"WYkdr1Q8DNz9ePBc9Qdxg4EYGTsBi4nU0/K6o8Z/uLfwGFEtph6wotuBiiwiPHQTSXKu411GcecDD294Dp6Notz8tDnMKe6zLIvNSyc9+HaivklYHurriMXOy3TUjCUFdxffeASFqtcnWIBYZV6x67uKlB7miN7bBXJCigmnR8+jh26JbzzIHzEbc8MlnbN/aylNyDeTqF5GIthd54j7KoCOX84F2JzwwvP3XOGrPXCopO6gSyASg/00kqozPu+iKqowqm8L4FXUX4uW4GKkDaZJiGqNAeeJQaNGHn4KKGTUEORtuXWQGNg/c0EzYU9QIC0ffnrrRMfvkBpgRyqQ2NfHJQV12NwjCnup2IEtzDnEpkSZ0CGbtaEJpCFRo1ti3zXU04buLhO7dBqk95OPhATdHCwQRrOshZfRqOAf7cv8vmAxzkgWlJ6YHxME+9MuLERQ6/K+oHnktU4C1VGE7gb1emI0cGwAZgsYODpFaM5WmF2czkcg0GFd7XOBbGYhmDflpAnuCMYARbrYf1yrfEGCvTcet1kazMd2r+6DVapbEW4KyZCilsE3MAycPkgGwZ9TKEiPE081ViqEiZEWZNKWNCYf9ql2onkWywHyZZUblq+YQTM3A3STgIFlXcdV/p/wSeOPXPg+FbU9ctHLA9CQiOhmhj5V/MHfovoFuivtO11bDIVGjg=="}' },
            { id: 'card6-title', data: '{"iv":"Zn84rf6uSR+vBBiG","data":"HV8pS+qOV6a2N86SUBgvXx9DiPZGVeRLamnvRFws69Bq8LxDbAnTCt8R"}' },
            { id: 'card6-sub', data: '{"iv":"1r9W9NvyfQLSFl69","data":"UveAw9RuQMiBd1ixk4GI1TvZfSdXIfQF1N3+itT+zBVH/zhg3bNGx8RdN4r+DJbgfXT7RghpL0q9djjCQg3SjM+MdYBuFcAO481fn2WORmUKbOu3LVmKRH1iosOeF3oAt19iPvLqR19A2P2PqK5+56xNs4cSvJGwZtkoRuge1/L/Y/cCQdPBmGS2l4Vfd8SDmV5+/7pDTAVurCjVaFatJcJFBGCwX5n28Zd42QozvARmLuqdKuZBQMEj2hXeb1Us55tbgfpLXkcDFL/hMblw6MdttKEdiez3/33QfeNsAWSIo40NoVrTsZ1jlkcu+qYIdJ11P7GJSOJHTqJQYepjJx5UMePUWOP5XYAjmavNnlleQmrEEjrElKQmVksvTOrg1mjk3RR/EQVAb2kFqBWcI6Qh/Mgye/9eKJr5/3eLjl0PgVRy2/7MfCFcFKo4X0Gs52q9tBaBviP5U7IiB+As/AeXpI1hxC1/i1VQ2bU8bY1avRC1q1gsltuyNUQaWK+K4GUFYm9Vbb1iM5fzFzEtzM60Mhai2T1oXOj6ZJ1ghKrZrMu+At2u8bpEattWvnhTNpnj8XfPADbA5u+2lQ6/tPUl0SRnwlHCLB464R+6XgXOpTrrQ9TnLlgOQytPuiGH/i/JVUr5fDlKU5QaAV8GKiSRSkrP/r1YscJjKwb1JJQl44OoSQUcmHTUCVlBJszLRxT2KY6NfMnjvDvHUy3yp7Ri2ghPO4xsSII9s70dtunFgjgBR4s9HiIPPMQ0mCTZ9Rywc8gGWJQ3/EbT4gssTyYBU3nQ0EHozneilj7bQJaaqs2hZtzzPMrgIw/Z3ysxGtaYFhkvhOpfwow/2RGCc4a++MHw5ZWotcK6Gk1z8Zy1hyfIkERy0o8fnHkS2bskELxd6jO979kaWJKnmGZBOf/KY7cfvs/m+CEazireKEfWUZc+raAv/77SFGsWSR5/sYhnZG6OYYw+wsrF+jrPPnrK8VQD10BRm3scyrfwrtEnt/G2ix+iDbIG6v7GCN6dEkpLqyElKuwIJzSuViuYd3mYRv3qSM9vnq3l6gEkeWydkiIdxGCUKfyjEFBJnS4q2KRrL+Wx1AfVPd3EjwYfXE8Bm5rrosIJ0qffM3+vE/VWf2aw40LAGulymtZTgXEO5mTslvFt38yfi5LLnORp+eBu3sEIvCmhozZqtlu0yAy1n+9bOHvcMlMf4yzWRnDuLh/FJlIu6geTJ/8xE3Hy7vw0jdtWCN59aJ1sQcfjPJSxZ148n6sA9WA+dyyR1+J0X3fFJVA3htLp8B/daUmlrcxzX/5P5uE8r1TwSxmh48BkGeYZfwlWjuOtOZzY4tcAM3Jdv+TqwS/9NIM3K6fKYP3Q6vJ+Qg=="}' },
        ],
        '#thank-you-block': [
            { id: 'thank-you-heading', data: '{"iv":"UVB0mfamUTtn7Y5C","data":"kkdAvJjdPLX8ZsQyxQxfdMYTZ9DqcRLG0We0yVRKIdaD18ka1/F0bt0="}' },
            { id: 'thank-you-sub', data: '{"iv":"sX5IjiAVEUcSr28l","data":"UtMGKoXMytVF+GM6RFQH76KX2KKdzf8WRSeVdGjDtRH+DGEvcksQ89DXfMFMuiA/Doe1Tx2O/rxiiXNk0pO8KIuFk3aPzfHgrIzB7n0u3xUlP+2wX+wHJOnuIXH02jPL6BvuQLCbFOhKNkR0LbVTPoKGe86WhqxjeFOVFbmm1s9JSxI8ZjOqGcfOcFkc9UlJHl62dllILjbCYm5ZYG5kG4i2j7SfaGyDfDQ3cEga3Wt6DUQuYl74tTsY"}' },
            { id: 'thank-you-credit', data: '{"iv":"J1LsoH69SVGHRIGL","data":"NfcL51zhAQVCei0uDSB05NZ5x7jxyR5pxmCXERoQMlCTrPGetW4S7RCcuR2L9HP+"}' }
        ]
    };

    // -------------------------------------------------------------
    // 2. CRYPTO HELPERS
    // -------------------------------------------------------------
    const bufferToBase64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
    const base64ToBuffer = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function getAESKey(secretPin) {
        const enc = new TextEncoder();
        const keyBuffer = await crypto.subtle.digest('SHA-256', enc.encode(secretPin));
        return crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
    }

    async function decryptMessage(encryptedJson, secretPin) {
        const { iv, data } = JSON.parse(encryptedJson);
        const key = await getAESKey(secretPin);
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: base64ToBuffer(iv) },
            key,
            base64ToBuffer(data)
        );
        return new TextDecoder().decode(decrypted);
    }

    // -------------------------------------------------------------
    // 3. AUTOMATIC DECRYPTION & NAVIGATION INSERTER
    // -------------------------------------------------------------
    window.decryptSection = async function (sectionSelector) {
        const targetList = ENCRYPTED_MESSAGES[sectionSelector];
        if (!targetList || !userSecretKey) return;

        for (const item of targetList) {
            try {
                const plainText = await decryptMessage(item.data, userSecretKey);
                const element = document.getElementById(item.id);
                if (element) {
                    element.innerHTML = plainText;
                }
            } catch (err) {
                console.error(`Decryption failed for element #${item.id}:`, err);
            }
        }
    };



    // -------------------------------------------------------------
    // 4. ENTRY SECTION PIN VERIFICATION
    // -------------------------------------------------------------
    const hiddenInput = document.getElementById('entry-pin-hidden');
    const boxes = document.querySelectorAll('#entry-pin-field .entry-pin-box');
    const button = document.getElementById('entry-pin-btn');
    const errorMsg = document.getElementById('entry-pin-error');
    const wrapper = document.getElementById('entry-pin-wrapper');

    const updateBoxes = () => {
        if (!hiddenInput) return;
        const val = hiddenInput.value.replace(/\D/g, '');
        hiddenInput.value = val;

        boxes.forEach((box, index) => {
            box.textContent = val[index] || '';
            if (index === val.length && document.activeElement === hiddenInput) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });
    };

    const resetInputs = () => {
        if (!hiddenInput) return;
        hiddenInput.value = '';
        updateBoxes();
        hiddenInput.focus();
    };

    async function checkEntryPinMatch(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isChecking) return;
        isChecking = true;

        const enteredPin = hiddenInput ? hiddenInput.value.replace(/\D/g, '') : '';

        if (enteredPin.length < 6) {
            if (errorMsg) errorMsg.classList.remove('hidden');
            resetInputs();
            isChecking = false;
            return;
        }

        const enteredHash = await hashString(enteredPin);

        if (enteredHash === ENTRY_PIN_HASH) {
            if (errorMsg) errorMsg.classList.add('hidden');

            // Save typed PIN into memory to use for section decryptions
            userSecretKey = enteredPin;

            // Unlock and navigate to next section (e.g., #view-gifts)
            await navigateSections('#entry-pin-section', '#name-field-block');
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
            resetInputs();
            isChecking = false;
        }
    }

    if (hiddenInput) {
        hiddenInput.addEventListener('input', updateBoxes);
        hiddenInput.addEventListener('focus', updateBoxes);
        hiddenInput.addEventListener('blur', () => {
            boxes.forEach(box => box.classList.remove('active'));
        });

        hiddenInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkEntryPinMatch(e);
            }
        });
    }

    if (wrapper && hiddenInput) {
        wrapper.addEventListener('click', () => {
            hiddenInput.focus();
        });
    }

    if (button) {
        button.addEventListener('click', (e) => {
            checkEntryPinMatch(e);
        });
    }

    if (hiddenInput) setTimeout(() => hiddenInput.focus(), 100);
});