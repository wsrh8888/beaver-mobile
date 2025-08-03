import { request } from '@/utils/request/request';
import { baseUrl } from '@/env.json';
import type {
  ICreateMomentReq,
  ICreateMomentRes,
  IGetMomentsReq,
  IGetMomentsRes,
  ILikeMomentReq,
  ILikeMomentRes,
  IGetMomentInfoReq,
  IGetMomentInfoRes,
  IDeleteMomentReq,
  IDeleteMomentRes,
  IAddCommentReq,
  IAddCommentRes,
  IDeleteCommentReq,
  IDeleteCommentRes,
  IMomentVisibilityReq,
  IMomentVisibilityRes,
  IMomentCommentListReq,
  IMomentCommentListRes,
  IUpdateMomentReq,
  IUpdateMomentRes,
  IGetMyMomentsReq,
  IGetMyMomentsRes,
  IGetFriendsMomentsReq,
  IGetFriendsMomentsRes,
  IUpdateCommentReq,
  IUpdateCommentRes,
  IGetCommentInfoReq,
  IGetCommentInfoRes,
  IGetLikesListReq,
  IGetLikesListRes,
  IReportMomentReq,
  IReportMomentRes,
  IFavoriteMomentReq,
  IFavoriteMomentRes
} from '@/types/ajax/moment';

/**
 * @description: 创建动态
 */
export const createMomentApi = (data: ICreateMomentReq) => {
  return request<ICreateMomentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/create`,
    data
  });
};

/**
 * @description: 获取自己和好友的动态列表
 */
export const getMomentsListApi = (data: IGetMomentsReq) => {
  return request<IGetMomentsRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/list`,
    data
  });
};

/**
 * @description: 点赞/取消点赞
 */
export const likeMomentApi = (data: ILikeMomentReq) => {
  return request<ILikeMomentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/like`,
    data
  });
};

/**
 * @description: 获取单个动态详情
 */
export const getMomentInfoApi = (data: IGetMomentInfoReq) => {
  return request<IGetMomentInfoRes>({
    method: 'GET',
    url: `${baseUrl}/api/moment/info`,
    data
  });
};

/**
 * @description: 删除动态
 */
export const deleteMomentApi = (data: IDeleteMomentReq) => {
  return request<IDeleteMomentRes>({
    method: 'GET',
    url: `${baseUrl}/api/moment/delete`,
    data
  });
};

/**
 * @description: 添加评论
 */
export const addCommentApi = (data: IAddCommentReq) => {
  return request<IAddCommentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/comment/add`,
    data
  });
};

/**
 * @description: 删除评论
 */
export const deleteCommentApi = (data: IDeleteCommentReq) => {
  return request<IDeleteCommentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/comment/delete`,
    data
  });
};

/**
 * @description: 更新动态可见性
 */
export const updateMomentVisibilityApi = (data: IMomentVisibilityReq) => {
  return request<IMomentVisibilityRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/visibility`,
    data
  });
};

/**
 * @description: 获取动态评论列表
 */
export const getMomentCommentsApi = (data: IMomentCommentListReq) => {
  return request<IMomentCommentListRes>({
    method: 'GET',
    url: `${baseUrl}/api/moment/comments`,
    data
  });
};

/**
 * @description: 更新动态
 */
export const updateMomentApi = (data: IUpdateMomentReq) => {
  return request<IUpdateMomentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/update`,
    data
  });
};

/**
 * @description: 获取我的动态列表
 */
export const getMyMomentsApi = (data: IGetMyMomentsReq) => {
  return request<IGetMyMomentsRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/my`,
    data
  });
};

/**
 * @description: 获取好友动态列表
 */
export const getFriendsMomentsApi = (data: IGetFriendsMomentsReq) => {
  return request<IGetFriendsMomentsRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/friends`,
    data
  });
};

/**
 * @description: 更新评论
 */
export const updateCommentApi = (data: IUpdateCommentReq) => {
  return request<IUpdateCommentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/comment/update`,
    data
  });
};

/**
 * @description: 获取评论详情
 */
export const getCommentInfoApi = (data: IGetCommentInfoReq) => {
  return request<IGetCommentInfoRes>({
    method: 'GET',
    url: `${baseUrl}/api/moment/comment/info`,
    data
  });
};

/**
 * @description: 获取点赞列表
 */
export const getLikesListApi = (data: IGetLikesListReq) => {
  return request<IGetLikesListRes>({
    method: 'GET',
    url: `${baseUrl}/api/moment/likes`,
    data
  });
};

/**
 * @description: 举报动态
 */
export const reportMomentApi = (data: IReportMomentReq) => {
  return request<IReportMomentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/report`,
    data
  });
};

/**
 * @description: 收藏/取消收藏动态
 */
export const favoriteMomentApi = (data: IFavoriteMomentReq) => {
  return request<IFavoriteMomentRes>({
    method: 'POST',
    url: `${baseUrl}/api/moment/favorite`,
    data
  });
};
