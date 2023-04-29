import {Pie as PieGraph} from "react-chartjs-2";
import {
    Chart,
    ArcElement as ArcElementChart,
    Title as TitleChart,
    Tooltip as TooltipChart,
    Colors as ColorsChart
} from 'chart.js';

export default function PieChart(props:{
    title:string,
    label: string[],
    values: {[label:string]:number}
}) {

    Chart.register(
        ArcElementChart,
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

    console.log(data)

    return <PieGraph options={options} data={data} />;
}