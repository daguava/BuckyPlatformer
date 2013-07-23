map = [{
        layer: "Main",
        priority: 0,
        elements: [
            {
                type: "Grass",
                x: 0, y: 15
            },{
                type: "Grass",
                x: 2, y: 14
            },{
                type: "Grass",
                x: 1, y: 15
            },{
                type: "Grass",
                x: 1, y: 14
            },{
                type: "Grass",
                x: 2, y: 13
            },{
                type: "Grass",
                x: 3, y: 12
            },{
                type: "Grass",
                x: 4, y: 11
            },{
                type: "Grass",
                x: 5, y: 10
            },{
                type: "Grass",
                x: 6, y: 10
            },{
                type: "Grass",
                x: 7, y: 10
            },{
                type: "Grass",
                x: 7, y: 11
            },{
                type: "Grass",
                x: 6, y: 11
            },{
                type: "Grass",
                x: 6, y: 12
            },{
                type: "Grass",
                x: 6, y: 13
            },{
                type: "Grass",
                x: 6, y: 14
            },{
                type: "Grass",
                x: 6, y: 15
            },{
                type: "Grass",
                x: 6, y: 16
            },{
                type: "Grass",
                x: 7, y: 15
            },{
                type: "Grass",
                x: 7, y: 16
            },{
                type: "Grass",
                x: 7, y: 17
            },{
                type: "Grass",
                x: 6, y: 17
            },{
                type: "Grass",
                x: 7, y: 12
            },{
                type: "Grass",
                x: 8, y: 12
            },{
                type: "Grass",
                x: 9, y: 12
            },{
                type: "Grass",
                x: 10, y: 12
            },{
                type: "Grass",
                x: 10, y: 12
            },{
                type: "Grass",
                x: 10, y: 11
            },{
                type: "Grass",
                x: 11, y: 12
            },{
                type: "Grass",
                x: 11, y: 11
            }
        ]
    }, {
        layer: "Main",
        priority: 1,
        elements: [
            {
                type: "Grass",
                x: 15, y: 15
            }
        ]
    }
];

for(var i = 0; i < 12500; i++){
    map[0].elements.push({type: "Grass", x: Math.floor(Math.random()*500), y: Math.floor(Math.random()*25)});
}