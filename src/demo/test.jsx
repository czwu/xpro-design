export default {
  install(app) {
    const icons = ["save", "json", "css", "debug"];
    icons.forEach((icon) => {
      let name = "XIcon" + icon.replace(icon[0], icon[0].toUpperCase());
      app.component(name, {
        render() {
          return <svg-icon icon-class={icon} />;
        }, 
      });
    });
  },
};
