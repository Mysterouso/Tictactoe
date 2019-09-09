
export default function(prefix,backgroundColor="#F5F5F5"){
    // const names = [
    //     `"${prefix}::-webkit-scrollbar`,
    //     `${prefix}::-webkit-scrollbar-thumb`,
    //     `${prefix}::-webkit-scrollbar-track`

    // ]

    return{
        [`${prefix}::-webkit-scrollbar`]:{
            // backgroundColor:"rgba(50,50,50,0.4)",
            width: 10,
            backgroundColor
        },
        [`${prefix}::-webkit-scrollbar-thumb`]:{
            // height:1,
            // width:1,
            backgroundColor:"#000",
        },       
        [`${prefix}::-webkit-scrollbar-track`]:{
            // borderRight: "1px solid black",
            backgroundColor
        }
    }
}
