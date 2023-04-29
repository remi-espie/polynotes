import {Bar as GraphBar} from "react-chartjs-2";
import {
    Chart,
    CategoryScale as CategoryScaleChart,
    LinearScale as LinearScaleChart,
    BarElement as BarElementChart,
    Title as TitleChart,
    Tooltip as TooltipChart,
    Colors as ColorsChart
} from 'chart.js';

export default function HorizontalBar(props:{
    title:string,
    label: string[],
    values: {[label:string]:number}
}) {

    Chart.register(
        CategoryScaleChart,
        LinearScaleChart,
        BarElementChart,
        TitleChart,
        TooltipChart,
        ColorsChart,
    );


    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: props.title,
            },
        },
    };

    const labels = props.label


    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: props.values,
            },
        ],
    };

    return <GraphBar options={options} data={data} />;
}