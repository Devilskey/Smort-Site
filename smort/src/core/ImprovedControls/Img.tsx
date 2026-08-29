import Style from "./Img.module.scss";

export const Img = (props:any) => (
    <img
      {...props}
      onLoad={(e:any) => {
        props.onLoad?.(e);
        e.currentTarget.classList.add(Style.loaded);
      }}
    />
);