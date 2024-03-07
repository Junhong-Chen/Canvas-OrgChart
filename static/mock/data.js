export default {
  name: '父亲',
  avatar: '',
  generation: 1,
  sex: 0,
  children: [
    {
      name: '哥哥',
      avatar: '',
      generation: 2,
      sex: 0,
      children: [
        {
          name: '侄子',
          avatar: '',
          generation: 3,
          sex: 0,
          spouse: {
            name: '侄媳',
            avatar: '',
            sex: 1,
          },
          children: []
        },
        {
          name: '侄女',
          avatar: '',
          generation: 3,
          sex: 1,
          children: []
        }
      ]
    },
    {
      name: '姐姐',
      avatar: '',
      generation: 2,
      sex: 1,
      children: [
        {
          name: '外甥',
          avatar: '',
          generation: 3,
          sex: 0,
          children: []
        },
        {
          name: '外甥女',
          avatar: '',
          generation: 3,
          sex: 1,
          children: []
        }
      ]
    },
    {
      name: '自己',
      avatar: '',
      generation: 2,
      sex: 0,
      self: true,
      children: [
        {
          name: '儿子',
          avatar: '',
          generation: 3,
          sex: 0,
          spouse: {
            name: '儿媳',
            avatar: '',
            sex: 1,
          },
          mySon: true,
          children: [
            {
              name: '孙子',
              avatar: '',
              generation: 4,
              sex: 0,
              children: [
                {
                  name: '曾孙',
                  avatar: '',
                  generation: 5,
                  sex: 0,
                  spouse: {
                    name: '曾孙媳',
                    avatar: '',
                    sex: 1,
                  },
                  children: []
                },
                {
                  name: '曾孙女',
                  avatar: '',
                  generation: 5,
                  sex: 1,
                  spouse: {
                    name: '曾孙女婿',
                    avatar: '',
                    sex: 0,
                  },
                  children: []
                }
              ]
            },
            
            {
              name: '孙女',
              avatar: '',
              generation: 4,
              sex: 1,
              children: [
                {
                  name: '外曾孙',
                  avatar: '',
                  generation: 5,
                  sex: 0,
                  children: []
                },
                {
                  name: '外曾孙女',
                  avatar: '',
                  generation: 5,
                  sex: 1,
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: '女儿',
          avatar: '',
          generation: 3,
          sex: 1,
          xxx: '',
          children: [
            {
              name: '外孙',
              avatar: '',
              generation: 4,
              sex: 0,
              children: []
            },
            {
              name: '外孙女',
              avatar: '',
              generation: 4,
              sex: 1,
              children: []
            }
          ]
        }
      ]
    },
    {
      name: '妹妹',
      avatar: '',
      generation: 2,
      sex: 1,
      children: [
        {
          name: '外甥',
          avatar: '',
          generation: 3,
          sex: 0,
          children: []
        },
        {
          name: '外甥女',
          avatar: '',
          generation: 3,
          sex: 1,
          children: []
        }
      ]
    }
  ]
}