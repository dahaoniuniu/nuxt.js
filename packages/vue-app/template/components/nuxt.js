<%= isTest ? '// @vue/component' : '' %>
import Vue from 'vue'
import { compile } from '../utils'

<% if (components.ErrorPage) { %>
  <% if (('~@').includes(components.ErrorPage.charAt(0))) { %>
import NuxtErrorComponent from '<%= components.ErrorPage %>'
  <% } else { %>
import NuxtErrorComponent from '<%= "../" + components.ErrorPage %>'
  <% } %>
<% } else { %>
import NuxtErrorComponent from './nuxt-error.vue'
<% } %>
import NuxtChild from './nuxt-child'

const NuxtError = {
  name: 'NuxtErrorBoundary',
  data: () => ({
    error: false
  }),
  errorCaptured (err, vm, info) {
  <% if (isDev) { %>
    console.error('Error in error page encountered')
    console.error(err, info)
  <% } %>
    this.error = true
  },
  render (h) {
    return this.error ? h('p', {} ,'An error occurred while rendering the error page') : h(NuxtErrorComponent)
  }
}

export default {
  name: 'nuxt',
  props: {
    nuxtChildKey: String,
    keepAlive: Boolean
  },
  render(h) {
    // If there is some error
    if (this.nuxt.err) {
      return h('nuxt-error', {
        props: {
          error: this.nuxt.err
        }
      })
    }
    // Directly return nuxt child
    return h('nuxt-child', {
      key: this.routerViewKey,
      props: this.$props
    })
  },
  beforeCreate() {
    Vue.util.defineReactive(this, 'nuxt', this.$root.$options.nuxt)
  },
  computed: {
    routerViewKey() {
      // If nuxtChildKey prop is given or current route has children
      if (typeof this.nuxtChildKey !== 'undefined' || this.$route.matched.length > 1) {
        return this.nuxtChildKey || compile(this.$route.matched[0].path)(this.$route.params)
      }
      const Component = this.$route.matched[0] && this.$route.matched[0].components.default
      if (Component && Component.options && Component.options.key) {
        return (typeof Component.options.key === 'function' ? Component.options.key(this.$route) : Component.options.key)
      }
      return this.$route.path
    }
  },
  components: {
    NuxtChild,
    NuxtError
  }
}