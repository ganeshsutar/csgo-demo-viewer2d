export const mapCfg = {
    "de_ancient": {
        mapFile: 'assets/maps/de_ancient/radar.png',
        "origin": {
            "x": 583.2590342775677,
            "y": 428.92222042149115
        },
        "pxPerUX": 0.1983512056034216,
        "pxPerUY": -0.20108163914549304,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_cache": {
        mapFile: 'assets/maps/de_cache/radar.png',
        "origin": {
            "x": 361.7243823603619,
            "y": 579.553558767951
        },
        "pxPerUX": 0.1830927328891829,
        "pxPerUY": -0.17650705879909936,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_dust2": {
        mapFile: 'assets/maps/de_dust2/radar.png',
        "origin": {
            "x": 563.1339320329055,
            "y": 736.9535330430065
        },
        "pxPerUX": 0.2278315639654376,
        "pxPerUY": -0.22776482548619972,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_inferno": {
        mapFile: 'assets/maps/de_inferno/radar.png',
        "origin": {
            "x": 426.51386123945593,
            "y": 790.7266981544722
        },
        "pxPerUX": 0.2041685571162696,
        "pxPerUY": -0.20465735943851654,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_mirage": {
        mapFile: 'assets/maps/de_mirage/radar.png',
        "origin": {
            "x": 645.7196725473384,
            "y": 340.2921393569175
        },
        "pxPerUX": 0.20118507589946494,
        "pxPerUY": -0.20138282875746794,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_nuke": {
        mapFile: 'assets/maps/de_nuke/radar.png',
        "high": {
            "origin": {
                "x": 473.1284773048749,
                "y": 165.7329003801045
            },
            "pxPerUX": 0.14376095926926907,
            "pxPerUY": -0.14736670935219626,
            isVisible: (height: number) => height >= -450,
        },
        "low": {
            "origin": {
                "x": 473.66746071612374,
                "y": 638.302101754172
            },
            "pxPerUX": 0.1436068746398272,
            "pxPerUY": -0.14533406508526941,
            isVisible: (height: number) => height < -450
        },
        imageWidth: 1024,
        imageHeight: 1024,
    },
    "de_overpass": {
        mapFile: 'assets/maps/de_overpass/radar.png',
        "origin": {
            "x": 927.3988878244819,
            "y": 343.8221009185496
        },
        "pxPerUX": 0.1923720959212443,
        "pxPerUY": -0.19427507725530338,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_train": {
        mapFile: 'assets/maps/de_train/radar.png',
        "origin": {
            "x": 527.365542903922,
            "y": 511.81469648562296
        },
        "pxPerUX": 0.21532584158170223,
        "pxPerUY": -0.21299254526091588,
        imageWidth: 1024,
        imageHeight: 1024
    },
    "de_vertigo": {
        mapFile: 'assets/maps/de_vertigo/radar.png',
        "high": {
            "origin": {
                "x": 784.4793452283254,
                "y": 255.42597837029027
            },
            "pxPerUX": 0.19856123172015677,
            "pxPerUY": -0.19820052722907044,
            isVisible: (height: number) => height >= 11700,
        },
        "low": {
            "origin": {
                "x": 780.5145858437052,
                "y": 695.4259783702903
            },
            "pxPerUX": 0.1989615567841087,
            "pxPerUY": -0.19820052722907044,
            isVisible: (height: number) => height < 11700
        },
        imageWidth: 1024,
        imageHeight: 1024,
    }
};
