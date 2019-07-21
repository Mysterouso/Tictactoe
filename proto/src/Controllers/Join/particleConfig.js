export const particleConfig = {
    "particles": {
        "number": {
            "value": 18,
            "density": {
                "enable":false
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "direction":"bottom-left",
            "speed": 4,
            "out_mode": "out"
        },
        "shape": {
            "type": [
                "images"
            ],
            "stroke":{
                "color":{
                    "value":"#EEE"
                }
            },
            "images": [
                {
                    "src": "https://image.flaticon.com/icons/svg/7/7909.svg",
                    "height": 20,
                    "width": 23
                },
                {
                    "src": "https://image.flaticon.com/icons/svg/25/25477.svg",
                    "height": 20,
                    "width": 23
                }
            ]
        },
        "color": {
            "value": "#EEE"
        },
        "size": {
            "value": 30,
            "random": false,
            // "anim": {
            //     "enable": true,
            //     "speed": 4,
            //     "size_min": 10,
            //     "sync": false
            // }
        }
    },
    "retina_detect": false
}