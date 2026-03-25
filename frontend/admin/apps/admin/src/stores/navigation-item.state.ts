import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import { createNavigationItemServiceClient } from '#/generated/api/admin/service/v1';
import { makeOrderBy, makeQueryString, makeUpdateMask } from '#/utils/query';
import { type Paging, requestClientRequestHandler } from '#/utils/request';

export const useNavigationItemStore = defineStore('navigation-item', () => {
  const service = createNavigationItemServiceClient(requestClientRequestHandler);
  const userStore = useUserStore();

  /**
   * 查询导航项列表
   */
  async function listNavigationItem(
    paging?: Paging,
    formValues?: null | object,
    fieldMask?: null | string,
    orderBy?: null | string[],
  ) {
    const noPaging =
      paging?.page === undefined && paging?.pageSize === undefined;
    return await service.List({
      // @ts-ignore proto generated code is error.
      fieldMask,
      orderBy: makeOrderBy(orderBy),
      query: makeQueryString(formValues, userStore.isTenantUser()),
      page: paging?.page,
      pageSize: paging?.pageSize,
      noPaging,
    });
  }

  /**
   * 获取导航项
   */
  async function getNavigationItem(id: number) {
    return await service.Get({ id });
  }

  /**
   * 创建导航项
   */
  async function createNavigationItem(values: Record<string, any> = {}) {
    return await service.Create({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新导航项
   */
  async function updateNavigationItem(
    id: number,
    values: Record<string, any> = {},
  ) {
    return await service.Update({
      id,
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
      // @ts-ignore proto generated code is error.
      updateMask: makeUpdateMask(Object.keys(values ?? [])),
    });
  }

  /**
   * 删除导航项
   */
  async function deleteNavigationItem(id: number) {
    return await service.Delete({ id });
  }

  function $reset() {}

  return {
    $reset,
    listNavigationItem,
    getNavigationItem,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
  };
});
