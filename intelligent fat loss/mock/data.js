import jwt from 'jsonwebtoken'
import Mock from 'mockjs'

const secret = '!&124coddefgg';

const getCards = (page, pageSize = 10) => {
  const cardHeight = Mock.Random.integer(300, 320);
  const imageHeight = Math.round(cardHeight * 0.85);
  return Array.from({ length: pageSize }, (_, i) => ({
    id: `${page}-${i}`,
    title: Mock.Random.ctitle(4, 8),
    price: Mock.Random.integer(20, 200),
    desc: Mock.Random.csentence(8, 16),
    // 提供更准确的高度范围（380-580）
    height: cardHeight,
    url: Mock.Random.image(`100x${imageHeight}`, Mock.Random.color(), "#fff", 'png')
  }))
}

//login 模块 mock 
export default [
  {
    url: '/api/login',
    method: 'post',
    timeout: 2000,//请求耗时
    response: ({ body }) => {
      //req username,password
      const { username, password } = body;
      console.log('Mock login attempt:', { username, password }); // 添加調試日誌
      if (username !== 'admin' || password !== '123456') {
        console.log('Login failed: invalid credentials'); // 添加調試日誌
        return {
          code: 1,
          message: '用户名或密码错误'
        }
      }
      console.log('Login successful'); // 添加調試日誌
      //生成token 颁发令牌
      //json 用户数据
      const token = jwt.sign({
        user: {
          id: "001",
          username,
        }
      }, secret, {
        expiresIn: 86400
      })
      return {
        code: 0,
        token,
        data: {
          id: "001",
          username,
        }
      }
    }
  }, {
    url: '/api/pages',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const page = query.page || 1;
      const pageSize = 10; // 每页10条
      const cards = getCards(page, pageSize); // 调用getCards生成卡片数组
      return {
        code: 0,
        data: { cards } // 返回的数据结构为 { cards: [...] }
      };
    }
  }, {
    url: '/api/detail/:id',  // 添加前导斜杠
    method: 'get',
    timeout: 1000,
    response: () => {
      const randomData = Mock.mock({
        title: '@ctitle(5, 10)',
        price: '@integer(60, 100)',
        desc: '@cparagraph(10,30)',
        images: [
          {
            url: 'https://img95.699pic.com/photo/60030/7828.jpg_wh860.jpg',
            alt: '1'
          },
          {
            url: 'https://img95.699pic.com/photo/60073/1839.jpg_wh860.jpg',
            alt: '2'
          },
          {
            url: 'https://img95.699pic.com/photo/60014/0156.jpg_wh860.jpg',
            alt: '3'
          },
        ]
      })

      return {
        code: 0,
        data: randomData
      }
    }
  },
  {
    url: '/api/search',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      // ?keyword=释小龙
      const keyword = query.keyword;
      let num = Math.floor(Math.random() * 10);
      let list = [];
      for (let i = 0; i < num; i++) {
        // 随机内容
        const randomData = Mock.mock({
          title: '@ctitle'
        })
        console.log(randomData)
        list.push(`${randomData.title}${keyword}`)
      }

      return {
        code: 0,
        data: list
      }
    }
  },
  {
    url: '/api/hotlist',
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        code: 0,
        data: [{
          id: '101',
          city: "鸡胸肉"
        }, {
          id: '102',
          city: "玉米"
        }, {
          id: '103',
          city: "牛肉"
        },
        {
          id: '104',
          city: "蔬菜沙拉"
        },
        ]
      }
    }
  },
]