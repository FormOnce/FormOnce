/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { UAParser } from 'ua-parser-js'

import {
  // Input,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icons,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui'
import type {
  FormViews,
  FormResponse as PrismaFormResponse,
} from '@prisma/client'
import { Share } from 'lucide-react'
import { DataTableColumnHeader } from './dataTableColumnHeader'

type FormResponse = PrismaFormResponse & {
  FormViews: FormViews
}

type TResponseTableProps = {
  data: FormResponse[]
}

export function ResponsesTable({ data }: TResponseTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const parser = new UAParser()

  const columns: ColumnDef<FormResponse>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="ml-2 justify-self-center"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="ml-2 justify-self-center"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'Browser',
      header: 'Browser',
      cell: ({ row }) => {
        if (!row.original.FormViews.userAgent) return 'Unknown'

        parser.setUA(row.original.FormViews.userAgent)
        const browser = parser.getBrowser().name
        return browser ?? 'Unknown'
      },
    },
    {
      accessorKey: 'OS',
      header: 'OS',
      cell: ({ row }) => {
        if (!row.original.FormViews.userAgent) return 'Unknown'

        parser.setUA(row.original.FormViews.userAgent)
        const os = parser.getOS().name
        return os ?? 'Unknown'
      },
    },
    {
      accessorKey: 'Device',
      header: 'Device',
      cell: ({ row }) => {
        if (!row.original.FormViews.userAgent) return 'Unknown'

        parser.setUA(row.original.FormViews.userAgent)
        const device = parser.getDevice().model
        return device ?? 'Unknown'
      },
    },
    {
      accessorKey: 'response',
      header: 'Response',
      cell: ({ row }) => (
        <div className="capitalize">
          <ul>
            {Object.entries(row.original.response as object).map(
              ([key, value]) => (
                <li key={key}>
                  <span className="">{key.replaceAll('_', ' ')} -</span>
                  <span className="ml-1">{value}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date and Time" />
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
          {(row.getValue('updatedAt') as Date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const response = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(response.response),
                  )
                }
              >
                Copy responses
                <Icons.copy className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify({
                      ...response,
                      response: undefined,
                      id: undefined,
                      formId: undefined,
                      createdAt: undefined,
                      started: response.createdAt,
                      updatedAt: response.updatedAt,
                      lastUpdated: response.updatedAt,
                      completed: response.completed,
                    }),
                  )
                }
              >
                Copy metadata
                <Icons.copy className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function flattenObject(ob: Record<string, unknown>) {
    const toReturn = {} as Record<string, unknown>

    for (const i in ob) {
      if (!ob.hasOwnProperty(i)) continue

      if (typeof ob[i] == 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i] as Record<string, unknown>)
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue

          toReturn[i + '__' + x] = flatObject[x]
        }
      } else {
        toReturn[i] = ob[i]
      }
    }
    return toReturn
  }

  function convertToCSV(arr: Record<string, unknown>[]) {
    const flatJsonArray = arr.map(flattenObject)
    const array = [Object.keys(flatJsonArray[0]!)].concat(
      flatJsonArray as unknown as string[][],
    )

    return array
      .map((it) => {
        return Object.values(it).toString()
      })
      .join('\n')
  }

  const handleExport = (type: 'csv' | 'json') => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original)

    const formattedData = data.map((response) => {
      const toReturn = {
        ...response,
        id: undefined,
        formId: undefined,
        createdAt: undefined,
        started: response.createdAt,
        updatedAt: response.updatedAt,
        lastUpdated: response.updatedAt,
        completed: response.completed,
      }
      delete toReturn.id
      delete toReturn.formId
      delete toReturn.createdAt
      return toReturn
    })

    let blob = new Blob([JSON.stringify(formattedData)], {
      type: 'application/json',
    })

    if (type === 'csv') {
      const csv = convertToCSV(formattedData)
      blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8',
      })
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `responses.${type}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      <div className="flex items-center pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-2">
              Export
              <Share className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className=" flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResponsesTable
