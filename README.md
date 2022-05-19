# Pinia Class Component

ECMAScript / TypeScript decorator for class-style Pinia store.

## Getting Started

```shell
npm install pinia-class-component || yarn add pinia-class-component
```

## Document

```ts
import { Store, Pinia } from 'pinia-class-component'
@Store
export class User extends Pinia {
  userInfo = {
    name: '',
    avatar: '',
    token: '',
  }
  get token() {
    return this.userInfo.token
  }
    async login(form) {
        // ...
        // this.userInfo = ...
    }
}

// usage
const user = new User()
user.login(...)
```

It be equal to:

```ts
import { defineStore } from 'pinia'

export const useUser = defineStore('User', {
  state: () => ({
    userInfo: {
      name: '',
      avatar: '',
      token: '',
    },
  }),
  getters: {
    token(state) {
      return state.userInfo.token
    },
  },
  actions: {
    async login(form) {
      // ...
    },
  },
})

// usage
const user = useUser()
user.login(...)
```

Inspired by [vue-class-component](https://github.com/vuejs/vue-class-component)

## License

[MIT](http://opensource.org/licenses/MIT)
