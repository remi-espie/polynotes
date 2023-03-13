import React from "react";

type commandProps = {
    items: [],
    command: (item: any) => void
}

class CommandsList extends React.Component<commandProps> {
    state = {
        selectedIndex: 0
    };

    componentDidUpdate(oldProps: { items: any; }) {
        if (this.props.items !== oldProps.items) {
            this.setState({
                selectedIndex: 0
            });
        }
    }

    onKeyDown({event}: { event: React.KeyboardEvent }) {
        if (event.key === "ArrowUp") {
            this.upHandler();
            return true;
        }

        if (event.key === "ArrowDown") {
            this.downHandler();
            return true;
        }

        if (event.key === "Enter") {
            this.enterHandler();
            return true;
        }

        return false;
    }

    upHandler() {
        this.setState({
            selectedIndex:
                (this.state.selectedIndex + this.props.items.length - 1) %
                this.props.items.length
        });
    }

    downHandler() {
        this.setState({
            selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length
        });
    }

    enterHandler() {
        this.selectItem(this.state.selectedIndex);
    }

    selectItem(index: number) {
        const item = this.props.items[index];

        if (item) {
            this.props.command(item);
        }
    }

    render() {
        const {items} = this.props;
        return (
            <div className="items">
                {items.map((item: { element: any; title: any; }, index: number) => {
                    return (
                        <button
                            className={`item ${
                                index === this.state.selectedIndex ? "is-selected" : ""
                            }`}
                            key={index}
                            onClick={() => this.selectItem(index)}
                        >
                            {item.element || item.title}
                        </button>
                    );
                })}
            </div>
        );
    }
}

export default CommandsList;
