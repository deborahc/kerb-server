#!/bin/sh
import remctl
import sys
import os

# Runs the commands from the client to communicate with SIPB XVM sever
# Output from XVM server is printed, which is piped to results array in kerb-server through python-shell library
def run_xvm_command():
    remctl_result = remctl.Remctl()
    # Parse the input from the client 
    ticket_location = sys.argv[1]
    xvm_command = sys.argv[2]
    xvm_machine_name = sys.argv[3]
    # By default, ticket is located in /tmp/krb5cc_{RANDOM HASH}
    ccache = ticket_location
    remctl_result.set_ccache(ccache)
    remctl_open = remctl_result.open(host = 'xvm-remote.mit.edu')
    command = ''
    if xvm_command == 'list':
        # Command to list all of user's VMs
        command = ('list', 'list')
        try:
            result = remctl_result.command(command)
            # returns string of all vms owned by user
            print remctl_result.output()[1]
            return remctl_result.output()[1]
        except remctl.RemctlProtocolError, error:
            print "Error:", str(error)
    elif xvm_command == 'reboot':
        # Command to reboot a particular machine
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
    # Delete the ticket after it is used        
    os.remove(ticket_location)

run_xvm_command()