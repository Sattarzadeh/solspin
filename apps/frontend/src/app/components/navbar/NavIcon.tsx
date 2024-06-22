// components/icons/IconComponent.js
import React from "react";

interface IconProps {
  className: string;
}

export const GamesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="22"
    height="14"
    viewBox="0 0 22 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.857 0.365296C13.9064 -0.25097 13.8889 1.86717 11.0038 1.86717C8.50775 1.86717 8.41414 -0.22697 5.15056 0.365296C-0.193422 1.33148 -1.015 13.089 1.82 13.7052C3.39397 14.0472 4.18695 12.2219 6.26797 10.9118C6.57688 11.1402 6.93577 11.2916 7.3149 11.3535C7.69402 11.4155 8.08245 11.3862 8.44799 11.2681C8.81353 11.1499 9.14564 10.9464 9.4168 10.6743C9.68796 10.4021 9.89035 10.0693 10.0072 9.70336C10.3383 9.67468 10.6705 9.66045 11.0028 9.6607C11.3528 9.6607 11.6797 9.6757 11.9931 9.7028C12.1102 10.0688 12.313 10.4016 12.5845 10.6736C12.8559 10.9456 13.1884 11.149 13.5542 11.2668C13.9199 11.3847 14.3086 11.4136 14.6878 11.3513C15.067 11.2889 15.4259 11.1371 15.7347 10.9083C17.8183 12.2184 18.6112 14.0456 20.1857 13.7032C23.0202 13.089 22.1776 1.47614 16.857 0.365296ZM5.91266 6.37669H4.68716V5.13061H3.44047V3.90516H4.68706V2.65861H5.91256V3.90464H7.15859V5.13014H5.91256V6.37617L5.91266 6.37669ZM7.70436 10.5774C7.38603 10.5774 7.07486 10.483 6.81018 10.3061C6.54551 10.1293 6.33922 9.87788 6.21741 9.58379C6.0956 9.28969 6.06373 8.96607 6.12584 8.65386C6.18795 8.34165 6.34124 8.05487 6.56633 7.82978C6.79143 7.6047 7.07821 7.45141 7.39043 7.38931C7.70264 7.32721 8.02625 7.35909 8.32035 7.48091C8.61444 7.60273 8.86581 7.80902 9.04266 8.0737C9.21951 8.33838 9.31391 8.64956 9.31391 8.96789C9.31403 9.39475 9.14458 9.80417 8.84284 10.1061C8.5411 10.408 8.13178 10.5777 7.70492 10.5779L7.70436 10.5774ZM14.2951 10.5774C13.9768 10.5771 13.6657 10.4824 13.4012 10.3054C13.1367 10.1283 12.9307 9.87685 12.8091 9.58269C12.6875 9.28854 12.6559 8.96494 12.7182 8.65281C12.7805 8.34068 12.9339 8.05403 13.1591 7.82911C13.3843 7.60418 13.6712 7.45107 13.9834 7.38915C14.2956 7.32722 14.6191 7.35925 14.9132 7.48119C15.2072 7.60313 15.4584 7.80951 15.6351 8.07423C15.8119 8.33894 15.9061 8.65012 15.906 8.96841C15.906 9.17989 15.8643 9.3893 15.7834 9.58467C15.7024 9.78003 15.5837 9.95752 15.4341 10.107C15.2845 10.2565 15.1069 10.375 14.9114 10.4558C14.716 10.5366 14.5065 10.5781 14.295 10.5779L14.2951 10.5774ZM15.4053 5.32936C15.2447 5.32939 15.0877 5.28178 14.9541 5.19257C14.8206 5.10335 14.7165 4.97654 14.655 4.82815C14.5935 4.67977 14.5774 4.51649 14.6088 4.35896C14.6401 4.20143 14.7174 4.05673 14.831 3.94316C14.9446 3.82959 15.0893 3.75225 15.2468 3.72092C15.4043 3.6896 15.5676 3.70569 15.716 3.76717C15.8644 3.82864 15.9912 3.93274 16.0804 4.0663C16.1696 4.19986 16.2172 4.35687 16.2172 4.51748C16.2172 4.73284 16.1316 4.93938 15.9794 5.09167C15.8271 5.24395 15.6205 5.3295 15.4052 5.3295L15.4053 5.32936ZM17.164 7.08811C17.0034 7.08812 16.8464 7.0405 16.7128 6.95129C16.5793 6.86207 16.4752 6.73525 16.4137 6.58688C16.3523 6.43851 16.3362 6.27524 16.3675 6.11772C16.3988 5.96021 16.4762 5.81551 16.5897 5.70194C16.7033 5.58838 16.8479 5.51103 17.0055 5.47969C17.163 5.44835 17.3262 5.46442 17.4746 5.52587C17.623 5.58732 17.7498 5.69139 17.8391 5.82492C17.9283 5.95845 17.9759 6.11544 17.9759 6.27605C17.976 6.38289 17.955 6.4887 17.9141 6.5874C17.8732 6.68611 17.8132 6.77577 17.7376 6.85126C17.662 6.92674 17.5722 6.98656 17.4734 7.02728C17.3746 7.06801 17.2688 7.08884 17.162 7.08858L17.164 7.08811ZM17.164 3.57023C17.0034 3.57024 16.8464 3.52263 16.7128 3.43341C16.5793 3.34419 16.4752 3.21737 16.4137 3.069C16.3523 2.92062 16.3362 2.75735 16.3675 2.59983C16.3988 2.44231 16.4762 2.29762 16.5897 2.18405C16.7033 2.07049 16.848 1.99314 17.0055 1.96181C17.163 1.93047 17.3263 1.94655 17.4747 2.00801C17.623 2.06947 17.7499 2.17354 17.8391 2.30708C17.9283 2.44062 17.9759 2.59761 17.9759 2.75822C17.976 2.86506 17.955 2.97086 17.9141 3.06956C17.8732 3.16826 17.8132 3.25792 17.7376 3.3334C17.662 3.40888 17.5722 3.46869 17.4734 3.50941C17.3746 3.55013 17.2688 3.57096 17.162 3.5707L17.164 3.57023ZM18.9226 5.32889C18.762 5.32889 18.605 5.28127 18.4715 5.19204C18.338 5.10281 18.2339 4.976 18.1724 4.82762C18.111 4.67924 18.0949 4.51597 18.1262 4.35846C18.1575 4.20094 18.2349 4.05625 18.3484 3.94269C18.462 3.82913 18.6067 3.75179 18.7642 3.72046C18.9217 3.68913 19.085 3.70521 19.2334 3.76667C19.3817 3.82813 19.5086 3.93221 19.5978 4.06574C19.687 4.19928 19.7346 4.35627 19.7346 4.51687C19.7347 4.62373 19.7137 4.72954 19.6728 4.82825C19.6319 4.92697 19.5719 5.01664 19.4963 5.09212C19.4206 5.1676 19.3308 5.22742 19.2321 5.26814C19.1333 5.30886 19.0274 5.32968 18.9206 5.32941L18.9226 5.32889Z"
      fill="currentColor"
    />
  </svg>
);

export const RewardsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="22"
    height="20"
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.30501 0.769142C6.57251 0.759975 4.88584 2.42831 5.65584 4.49997H2.75001C2.26377 4.49997 1.79746 4.69313 1.45364 5.03695C1.10983 5.38076 0.916672 5.84708 0.916672 6.33331V8.16664C0.916672 8.40976 1.01325 8.64291 1.18516 8.81482C1.35707 8.98673 1.59022 9.08331 1.83334 9.08331H10.0833V6.33331H11.9167V9.08331H20.1667C20.4098 9.08331 20.6429 8.98673 20.8149 8.81482C20.9868 8.64291 21.0833 8.40976 21.0833 8.16664V6.33331C21.0833 5.84708 20.8902 5.38076 20.5464 5.03695C20.2026 4.69313 19.7362 4.49997 19.25 4.49997H16.3442C17.4167 1.50248 13.3833 -0.615025 11.5225 1.96997L11 2.66664L10.4775 1.95164C9.90001 1.13581 9.10251 0.778308 8.30501 0.769142ZM8.25001 2.66664C9.06584 2.66664 9.47834 3.65664 8.90084 4.23414C8.32334 4.81164 7.33334 4.39914 7.33334 3.58331C7.33334 3.34019 7.42992 3.10704 7.60182 2.93513C7.77373 2.76322 8.00689 2.66664 8.25001 2.66664ZM13.75 2.66664C14.5658 2.66664 14.9783 3.65664 14.4008 4.23414C13.8233 4.81164 12.8333 4.39914 12.8333 3.58331C12.8333 3.34019 12.9299 3.10704 13.1018 2.93513C13.2737 2.76322 13.5069 2.66664 13.75 2.66664ZM1.83334 9.99997V17.3333C1.83334 17.8195 2.02649 18.2859 2.37031 18.6297C2.71413 18.9735 3.18044 19.1666 3.66667 19.1666H18.3333C18.8196 19.1666 19.2859 18.9735 19.6297 18.6297C19.9735 18.2859 20.1667 17.8195 20.1667 17.3333V9.99997H11.9167V17.3333H10.0833V9.99997H1.83334Z"
      fill="currentColor"
    />
  </svg>
);

export const LeaderboardsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.475 16C3.24033 16 2.186 15.563 1.312 14.689C0.438 13.815 0.000666667 12.7603 0 11.525C0 10.3097 0.424667 9.26767 1.274 8.399C2.12333 7.53033 3.15567 7.08267 4.371 7.056C4.499 7.056 4.62733 7.06567 4.756 7.085C4.884 7.10433 5.012 7.12667 5.14 7.152L2.438 1.7C2.29667 1.43067 2.30267 1.16967 2.456 0.917001C2.60933 0.665001 2.83933 0.539001 3.146 0.539001H5.62C5.92667 0.539001 6.20833 0.619668 6.465 0.781002C6.72233 0.942335 6.92333 1.15767 7.068 1.427L9 5.307L10.93 1.427C11.0753 1.15767 11.2767 0.942335 11.534 0.781002C11.7907 0.619668 12.0723 0.539001 12.379 0.539001H14.837C15.1437 0.539001 15.3767 0.665001 15.536 0.917001C15.6953 1.17033 15.7047 1.43133 15.564 1.7L12.884 7.083C13 7.057 13.119 7.03767 13.241 7.025C13.3623 7.01167 13.4873 7.005 13.616 7.005C14.84 7.03633 15.8767 7.48633 16.726 8.355C17.5753 9.22367 18 10.272 18 11.5C18 12.7513 17.563 13.8143 16.689 14.689C15.815 15.5637 14.752 16.0007 13.5 16C13.3113 16 13.1187 15.9893 12.922 15.968C12.7253 15.9473 12.5393 15.9073 12.364 15.848C13.152 15.5047 13.705 14.921 14.023 14.097C14.341 13.273 14.5 12.4073 14.5 11.5C14.5 9.96533 13.967 8.665 12.901 7.599C11.835 6.533 10.5347 6 9 6C7.46533 6 6.165 6.533 5.099 7.599C4.033 8.665 3.5 9.96533 3.5 11.5C3.5 12.4153 3.64667 13.296 3.94 14.142C4.23333 14.9887 4.79667 15.5573 5.63 15.848C5.442 15.9073 5.253 15.9473 5.063 15.968C4.873 15.9887 4.677 15.9993 4.475 16ZM9 16C7.75 16 6.68767 15.5627 5.813 14.688C4.93833 13.8133 4.50067 12.7507 4.5 11.5C4.49933 10.2493 4.937 9.187 5.813 8.313C6.689 7.439 7.75133 7.00133 9 7C10.2487 6.99867 11.3113 7.43633 12.188 8.313C13.0647 9.18967 13.502 10.252 13.5 11.5C13.498 12.748 13.0607 13.8107 12.188 14.688C11.3153 15.5653 10.2527 16.0027 9 16ZM9 12.6L10.071 13.41C10.1583 13.4673 10.239 13.4683 10.313 13.413C10.387 13.3577 10.4077 13.2843 10.375 13.193L9.977 11.859L11.029 11.1C11.1157 11.0427 11.1423 10.9693 11.109 10.88C11.0757 10.7907 11.0117 10.746 10.917 10.746H9.61L9.192 9.352C9.15867 9.26133 9.09467 9.216 9 9.216C8.90533 9.216 8.84133 9.26133 8.808 9.352L8.391 10.746H7.083C6.98833 10.746 6.92433 10.7907 6.891 10.88C6.85767 10.9693 6.88433 11.0427 6.971 11.1L8.023 11.86L7.625 13.192C7.59167 13.2833 7.61233 13.3567 7.687 13.412C7.76167 13.4673 7.84233 13.4667 7.929 13.41L9 12.6Z"
      fill="currentColor"
    />
  </svg>
);

export const CasesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.47 0.152002C8.62894 0.0526697 8.81258 0 9 0C9.18742 0 9.37107 0.0526697 9.53 0.152002L16.434 4.467L9 8.84L1.566 4.467L8.47 0.152002ZM0.00800346 5.871C0.00256063 5.91378 -0.000111505 5.95687 3.56307e-06 6V14C3.16305e-06 14.1696 0.043141 14.3364 0.12536 14.4848C0.207579 14.6331 0.326178 14.7581 0.470004 14.848L8 19.554V10.572L0.00800346 5.871ZM10 19.554L17.53 14.848C17.6738 14.7581 17.7924 14.6331 17.8746 14.4848C17.9569 14.3364 18 14.1696 18 14V6C18 5.957 17.997 5.913 17.992 5.871L10 10.571V19.554Z"
      fill="currentColor"
    />
  </svg>
);