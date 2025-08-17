import { create } from 'zustand'
import { getPages } from '../api/pages'

export const usePagesStore = create((set, get) => ({
  cards: [
    {
      id: 1 - 0,
      title: '贝贝南瓜',
      price: 6.99,
      desc: '优质零食贝贝南瓜早餐健康无添加',
      height: 450,
      url: 'https://img.alicdn.com/i3/2210336646288/O1CN01DzhcJU1wJx9ney0Se_!!2210336646288.jpg',
    }, {
      id: 1 - 1,
      title: '低脂鸡胸肉',
      price: 15,
      desc: '低脂鸡胸肉开袋即食，美味健康无添加',
      height: 420,
      url: 'https://img.alicdn.com/imgextra/i1/3567579815/TB2NP47X8mWBuNkSndVXXcsApXa_!!3567579815.jpg',
    },
    {
      id: 1 - 2,
      title: '云南甜脆玉米',
      price: 6.2,
      desc: '水果玉米开袋即食，0添加健康美味',
      height: 420,
      url: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.tCfJ6Wj1UMBVEt1UST2AEAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
      id: 1 - 3,
      title: '荞麦面',
      price: 6.9,
      desc: '荞麦面方便面0脂肪添加，带调料报免煮',
      height: 450,
      url: 'https://img.alicdn.com/i2/2869028824/O1CN01kJjOzN2F3RciOFI1u_!!2869028824.jpg',
    },
    {
      id: 1 - 4,
      title: '去皮鸡腿',
      price: 12.8,
      desc: '去皮鸡腿75g开袋即食低脂，减脂期高蛋白摄入',
      height: 450,
      url: 'https://cbu01.alicdn.com/img/ibank/O1CN01OvH6dB1jMAKR802Mx_!!2206462824533-0-cib.jpg',
    },
    {
      id: 1 - 5,
      title: '糙米饭团',
      price: 10.1,
      desc: '7日糙米饭团免煮即食轻食低脂芋泥红豆绿豆夹心',
      height: 420,
      url: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.wk0nooorDiRgGIlgI5cn5gHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
      id: 1 - 6,
      title: '蔬菜沙拉',
      price: 11.1,
      desc: '混合蔬菜沙拉3包，含番茄、生菜、胡萝卜等',
      height: 420,
      url: 'https://pic.huitu.com/res/20221029/921938_20221029133540839221_1.jpg',
    },
    {
      id: 1 - 7,
      title: '全麦面包',
      price: 5.8,
      desc: '全麦面包100g，含全麦粉、酵母、糖等',
      height: 450,
      url: 'https://ts1.tc.mm.bing.net/th/id/R-C.b7bba58dd54628409e5af87dbab16e1a?rik=YV2AK2c1g%2fRiGA&riu=http%3a%2f%2fwww.bingguner.com%2fupimg%2fallimg%2f230506%2f27-2305061H520418.jpg&ehk=ZR%2fJwxL5GnM6AVOR%2bcnS0KhgekULaFAN0jR%2b6vZKty0%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      id: 1 - 8,
      title: '即食蜜薯',
      price: 12.8,
      desc: '0脂肪0添加即食蜜薯，适合减脂期摄入',
      height: 420,
      url: 'https://cbu01.alicdn.com/img/ibank/O1CN01Gqa9PG28Ei9RjVB2q_!!984827901-0-cib.jpg',
    }, {
      id: 1 - 9,
      title: '白水煮鸡蛋',
      price: 7.5,
      desc: '水煮鸡蛋35g即食健身代餐高蛋白',
      height: 420,
      url: 'https://n.sinaimg.cn/sinakd10100/303/w640h463/20220702/188f-8a4d2b1f81de559bf9f0acf5804cfe8c.jpg',
    }
  ],
  page: 1,
  loading: false,
  fetchMore: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await getPages(get().page);
      console.log(res);
      const newCards = res.data.data.cards;
      set((state) => ({
        cards: [...state.cards, ...newCards],
        page: state.page + 1,
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      console.error("获取数据失败:", error);
    }
  }
}))