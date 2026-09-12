Component({
  properties: {
    title: String,
    description: String,
    actionLabel: String,
  },
  methods: {
    onAction() {
      this.triggerEvent('action')
    },
  },
})
