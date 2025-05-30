import { DataNode } from "ant-design-vue/es/tree";

export let tree: DataNode[] = [
    {
        name: 'group',
        title: '开关制造车间', 
        key: 'GROP00010001',  
        children: [
            {
                name: 'line',
                title: 'HJ1组',
                key: 'LINE00010001',
                children: [
                    {
                        name: 'danyuan',
                        title: '天正小安培1组热焊PLC',
                        key: 'DANY00010001',
                        children: [
                            {
                                name: 'station',
                                title: '工位1',
                                key: 'STA00010001',
                            },
                            {
                                name: 'station',
                                title: '工位2',
                                key: 'STA00010002'
                            },
                            {
                                name:'sensor',
                                key:'SENS00010001',
                                title:'天正小安培1组热焊PLC传感器'
                            },
                            {
                                name:'sensor',
                                key:'SENS00010002',
                                title:'天正小安培1组热焊触摸屏传感器'
                            },
                            {
                                name:'sensor',
                                key:'SENS00010055',
                                title:'天正新设备大安培热打螺丝PLC传感器'
                            }
                        ]

                    },
                    { name: 'danyuan', title: '天正小安培1组热焊触摸屏', key: 'DANY00010002' },
                ]
            },
            {
                name: 'line',
                title: 'HJ2组',
                key: 'LINE00010002',
            },
            {
                name: 'line',
                title: 'HJ3组',
                key: 'LINE00010003',
            },
            {
                name: 'line',
                title: 'HJ5组',
                key: 'LINE00010005',
                children:[
                    {title:'天正5号摄像头',key:'CAMA00010005',name:'camera'}
                ]
            },
            {
                name: 'line',
                title: 'HJ6组',
                key: 'LINE00010006',
                children: [
                    { title: '天正新设备大安培热打螺丝PLC', key: 'DANY00010055' }
                ]
            }
        ]
    }
];