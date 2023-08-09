import LoadingIcon from "../assets/imgs/icons/loading.svg";

const LoadingIndicator = ({ indicatorWidth }: { indicatorWidth: string }) => {
    return <img width={indicatorWidth} src={LoadingIcon} alt="" />;
};

export default LoadingIndicator;
