import {Line as GraphLine} from "react-chartjs-2";
import {
    Chart,
    CategoryScale as CategoryScaleChart,
    LinearScale as LinearScaleChart,
    PointElement as PointElementChart,
    LineElement as LineElementChart,
    Title as TitleChart,
    Tooltip as TooltipChart,
    Colors as ColorsChart,
} from 'chart.js';

export default function LineChart(props:{
    title:string,
    label: string[],
    values: {[label:string]:number}
}) {

    Chart.register(
        CategoryScaleChart,
        LinearScaleChart,
        PointElementChart,
        LineElementChart,
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

    return <GraphLine options={options} data={data} />;
}