const defaultFiles = [
    {
        id:'1',
        type: 'folder',
        title: 'life',
        content: [
            {
                id:'1-1',
                type: 'list',
                title: 'daily affairs',
                content: [{
                    id: '1-1-1',
                    type: 'entry',
                    content: 'eating',
                    createdAt: 1563762965704,
                },
                {
                    id: '1-1-2',
                    type: 'entry',
                    content: 'working',
                    createAt: 1563762965704,
                }],
                createdAt: 1563762965704,
            },{
                id:'1-2',
                type: 'list',
                title: 'weekly affairs',
                content: [{
                    id: '1-2-1',
                    type: 'entry',
                    content: 'working out',
                    createdAt: 1563762965704,
                },
                {
                    id: '1-2-2',
                    type: 'entry',
                    content: 'reading book',
                    createAt: 1563762965704,
                }],
                createdAt: 1563762965704,
            }
        ],
        createdAt: 1563762965704,
    }
    ,{
        id: '2',
        type: 'folder',
        title: 'work',
        content: [
            {
                id:'2-1',
                type: 'list',
                title: 'daily affairs',
                content: [{
                    id: '2-1-1',
                    type: 'entry',
                    content: 'programming',
                    createdAt: 1563762965704,
                }],
                createdAt: 1563762965704,
            },{
                id:'2-2',
                type: 'list',
                title: 'weekly affairs',
                content: [{
                    id: '2-2-1',
                    type: 'entry',
                    content: 'wrting report',
                    createdAt: 1563762965704,
                },
                {
                    id: '2-2-2',
                    type: 'entry',
                    content: 'meeting',
                    createAt: 1563762965704,
                }],
                createdAt: 1563762965704,
            }
        ],
        createdAt: 1563762965704,
    },
    {
        id: '0-1',
        type: 'list',
        title: 'to-dos',
        content: [
            {
                id: '0-1-1',
                type: 'entry',
                content: 'studying',
                createAt: 1563762965704,
            }
        ],
        createdAt: 1563762965704,
    }
];

export default defaultFiles;