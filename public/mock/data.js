const data = {
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
      spouse: {
        name: '老婆',
        avatar: '',
        sex: 1,
      },
      children: [
        {
          name: '儿子',
          avatar: '',
          generation: 3,
          sex: 0,
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
                  children: []
                },
                {
                  name: '曾孙女',
                  avatar: '',
                  generation: 5,
                  sex: 1,
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
              avatar: 'xx',
              generation: 4,
              sex: 1,
              children: []
            }
          ]
        }
      ]
    },
    {
      name: '弟弟',
      avatar: '',
      generation: 2,
      sex: 0,
      children: [
        {
          name: '侄子',
          avatar: '',
          generation: 3,
          sex: 0,
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

export default data
