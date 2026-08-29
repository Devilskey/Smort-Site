import Style from "./Video.module.scss";

export const Video = (props: any) => (
  <video
    {...props}
    onCanPlay={(e: any) => {
      props.onLoad?.(e);
      e.currentTarget.classList.add(Style.loaded);
    }}
  />
);