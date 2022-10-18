export function setup(): void {
    Array.from(document.getElementsByTagName('textarea')).forEach((element) => {
        element.style.height = `${element.scrollHeight}px`;
        element.style.overflowY = 'hidden';
        element.addEventListener(
            'input',
            () =>{
                element.style.height = 0;
                element.style.height = `${element.scrollHeight}px`;
            },
            false,
        );
    });
}
