// 创建新文件来声明 GSAP 的类型
declare module 'gsap' {
  interface GSAPTween {
    progress: number;
  }
  
  interface GSAP {
    to(target: any, vars: any): any;
    getProperty(target: any, property: string): any;
    killTweensOf(target: any): void;
  }
  
  const gsap: GSAP;
  export default gsap;
} 