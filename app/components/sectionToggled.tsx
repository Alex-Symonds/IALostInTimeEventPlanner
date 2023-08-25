import { Button } from './buttons';

export function SectionToggled({title, children} 
    : {title : string, children : React.ReactNode})
    : JSX.Element {

    return(
        <div className={"text-sm overflow-y-auto overflow-x-hidden max-h-[calc(100vh-5rem)] w-full pb-2"}>
            <h2 className={"text-lg font-bold ml-1 mb-2"}>{title}</h2>
            {children}
      </div>
    )
}

export function EditButtonBox({openEditForm, label} 
    : {openEditForm : () => void, label : string | undefined})
    : JSX.Element {

    return(
        <div className={"mt-6"}>
            <Button 
                size={'default'}
                colours={'primary'}
                onClick={() => openEditForm()}
                >
                    {label ?? 'edit'}
            </Button>
        </div>
    )
}