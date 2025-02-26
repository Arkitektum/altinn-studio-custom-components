export default class ValidationMessages {
    constructor(props) {
        this.error = props?.error || [];
        this.warning = props?.warning || [];
        this.info = props?.info || [];
        this.success = props?.success || [];
        this.default = props?.default || [];
    }
}
