import axios from "../axios";

/**
 * 获取文件
 */
export const asyncFileApi = () => axios.post('/syncFile')

/**
 *  获取共享文件
 */
export const searchUpdate = (title: string,content: string) => axios.get('/searchUpdateJDBC',{ params: { title,content } })

/**
 * 获取文件列表
 */
export const asyncFileListApi = () => axios.get('/getFileInfo')

/**
 * 获取共享文件列表
 */
export const asyncSearchFileListApi = () => axios.get('/getSearchFileInfo')

/**
 * 获取共享文件列表
 */
export const searchFile = (data: FormData) => axios.post('/searchFile',data)

/**
 * 文件预览
 */
export const filePreviewApi = (path: string) => axios.get('/preview', { params: { path } })

/**
 * 文件上传
 */
export const fileUploadApi = (data: FormData) => axios.post('/upload', data)

/**
 * 共享文件上传
 */
export const SearchFileUploadApi = (data: FormData) => axios.post('/searchUpload', data)

/**
 * 文件删除
 */
export const fileDeleteApi = (filePath: string) => axios.post('/deleteFolder', { filePath })

/**
 * 文件重命名
 */
export const fileRenameApi = (filePath: string, newFileName: string) => axios.post('/rename', { filePath, newFileName })

/**
 * 文件夹创建
 */
export const fileCreateApi = (folderName: string) => axios.get('/createFolder', { params: { folderName } })

/**
 * 删除到回收站
 */
export const fileDeleteToRecycleApi = (filePath: string) => axios.get('/deleteToRecycle', { params: { filePath } })


/**
 * 获取回收站文件列表
 */
export const asyncRecycleFileListApi = () => axios.get('/getRecycleList')

export const queryFileInfoList = (paging:any) => axios.post('/queryFileInfoList', paging)