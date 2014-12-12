#!/bin/sh
import remctl
import sys
import os

def main():
    # command = ('control', 'pistachio', 'create')
    remctl_result = remctl.Remctl()
    ticket_location = sys.argv[1]
    xvm_command = sys.argv[2]
    xvm_machine_name = sys.argv[3]

    
    ticket_location = '/tmp/krb5cc_1000'

    ccache = ticket_location
    remctl_result.set_ccache(ccache)
    remctl_open = remctl_result.open(host = 'xvm-remote.mit.edu')

    command = ''
    if xvm_command == 'list':
        command = ('list', 'list')
        try:
            result = remctl_result.command(command)
            # returns string of all vms owned by user
            print remctl_result.output()[1]
            return remctl_result.output()[1]
        except remctl.RemctlProtocolError, error:
            print "Error:", str(error)
    elif xvm_command == 'reboot':
        command = ('control', xvm_machine_name, 'reboot')
        try:
            remctl_result.command(command)
            output = remctl_result.output()
            if output[0] == 'status':
                print 'Done!'
                return 'Done!'
            elif output[0] == 'output':
                print output[1]
                return output[1]
        except remctl.RemctlProtocolError, error:
            print "Error:", str(error)

main()