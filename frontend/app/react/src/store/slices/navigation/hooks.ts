import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '@/store';
import {
  listNavigation,
  getNavigation,
  createNavigation,
  updateNavigation,
  deleteNavigation,
  clearNavigationDetail,
 resetNavigation,
} from './slice';
import type {siteservicev1_NavigationItem} from '@/api/generated/app/service/v1';

export function useNavigationStore() {
 const navigation = useSelector((state: RootState) => state.navigation);
 const dispatch = useDispatch();

  /**
   * 递归查找导航项
   */
 const findNavItem = (items: siteservicev1_NavigationItem[], id: number): siteservicev1_NavigationItem | undefined => {
    for (const item of items) {
      if (item.id === id) {
       return item;
      }
      if (item.children && item.children.length > 0) {
       const found = findNavItem(item.children, id);
        if (found) {
         return found;
        }
      }
    }
   return undefined;
  };

 return {
    ...navigation,
   listNavigation: async (params: {page?: number; pageSize?: number}) => {
      const action = await dispatch(listNavigation(params));
      return action.payload;
    },
    getNavigation: (id: number) => dispatch(getNavigation({id})),
    createNavigation: (values: Parameters<typeof createNavigation>[0]) => dispatch(createNavigation(values)),
    updateNavigation: (id: number, values: Parameters<typeof updateNavigation>[0]['values']) => 
     dispatch(updateNavigation({id, values})),
   deleteNavigation: (id: number) => dispatch(deleteNavigation(id)),
    clearNavigationDetail: () => dispatch(clearNavigationDetail()),
   resetNavigation: () => dispatch(resetNavigation()),
    findNavItem,
  };
}
