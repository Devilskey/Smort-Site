declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.png' {
    const value: string;
    export default value;
  }

declare module '*.css';
declare module '*.scss';
declare module '*.sass';