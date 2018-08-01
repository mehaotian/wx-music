import https from './api'

/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 */

// 单独导出

//  轮播图
export const http_banner = (data) => {
    return https({
        url: '/banner',
        // method: 'GET', // 默认GET
        data
    })
}

//  个性化推荐
export const http_newsong = (data) => {
    return https({
        url: '/personalized/newsong',
        data
    })
}

// 获取推荐歌单  
export const http_highquality = (data) => {
    return https({
        url: '/top/playlist/highquality',
        data
    })
}
//  推荐mv 
export const http_mv = (data) => {
    return https({
        url: '/personalized/mv',
        data
    })
}


//  登陆
export const http_login = (data) => {
    return https({
        url: '/login/cellphone',
        data
    })
}

//  用户信息
export const http_user_detail = (data) => {
    return https({
        url: '/user/detail',
        data
    })
}

//  歌单信息
export const http_playlist = (data) => {
    return https({
        url: '/user/playlist',
        data
    })
}

//  歌单详情
export const http_playlist_detail = (data) => {
    return https({
        url: '/playlist/detail',
        data
    })
}

//  排行榜
export const http_top_list = (data) => {
    return https({
        url: '/top/list',
        data
    })
}

// 获取音乐url
export const http_music_url = (data) => {
    return https({
        url: '/music/url',
        data
    })
}
// 默认全部导出
export default {
    http_banner,
    http_newsong,
    http_highquality,
    http_mv,
    http_login,
    http_user_detail,
    http_playlist,
    http_playlist_detail,
    http_top_list,
    http_music_url
}