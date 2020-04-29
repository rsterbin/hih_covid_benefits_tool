#!/usr/bin/perl

use Clone 'clone';
use Data::Dumper;

my $list = "$ARGV[0]" || '';
my $view = "$ARGV[1]" || '';

my $options;
if ($list eq 'federal') {
    $options = get_federal_options();
} elsif ($list eq 'state') {
    $options = get_state_options();
} elsif ($list eq 'reasons') {
    $options = get_reasons_only_options();
} else {
    usage();
    exit;
}

if ($view eq 'options') {
    foreach my $q (@$options) {
        foreach my $a (@{$q->{a}}) {
            print "[$q->{q}] $a->{t}\n";
        }
    }
    print "\n";
} elsif ($view eq 'codes') {
    my $combos = all_combinations($options);
    foreach my $scenario (@$combos) {
        print "\n";
        print "{\n";
        foreach my $item (@$scenario) {
            print '  "' . $item->{question} . '": "' . $item->{answer_code} . '",' . "\n";
        }
        print "}\n";
    }
} elsif ($view eq 'combos') {
    my $combos = all_combinations($options);
    foreach my $scenario (@$combos) {
        print "\n";
        foreach my $item (@$scenario) {
            print "[$item->{question}] $item->{answer_text}\n";
        }
    }
} else {
    usage();
    exit;
}


=pod all_combinations()

Finds all combinations of answers for a given set of questions

@param  arrayref $todo the set of questions and answers to combine
@return arrayref the possible combos, like so:

[
    [
        { question => 'q1', answer_text => 'FIRST RESPONSE', answer_code => 'A' },
        { question => 'q2', answer_text => 'RESPONSE THE FIRST', answer_code => 'A' },
    ]
    [
        { question => 'q1', answer_text => 'FIRST RESPONSE', answer_code => 'A' },
        { question => 'q2', answer_text => 'RESPONSE THE SECOND', answer_code => 'B' },
    ],
    [
        { question => 'q1', answer_text => 'SECOND RESPONSE', answer_code => 'B' },
        { question => 'q2', answer_text => 'RESPONSE THE FIRST', answer_code => 'A' },
    ],
    [
        { question => 'q1', answer_text => 'SECOND RESPONSE', answer_code => 'B' },
        { question => 'q2', answer_text => 'RESPONSE THE SECOND', answer_code => 'B' },
    ],
]

=cut
sub all_combinations {
    my $todo = shift;
    my $question = shift @$todo;
    my $others;
    if (scalar @$todo > 0) {
        $others = all_combinations($todo);
    } else {
        $others = [];
    }
    my @combos = ();
    foreach my $answer (@{$question->{a}}) {
        my $val = { question => $question->{q}, answer_text => $answer->{t}, answer_code => $answer->{c} };
        if (scalar @$others > 0) {
            foreach my $o (@$others) {
                my $combo = clone $o;
                unshift @$combo, $val;
                push @combos, $combo;
            }
        } else {
            push @combos, [ $val ];
        }
    }
    return \@combos;
}

sub get_federal_options {
    return [
        {
            q => 'type',
            a => [
                { t => 'NANNY, HOUSE CLEANER, or HOME ATTENDANT', c => 'A|B|C' },
                { t => 'HOME HEALTH CARE WORKER', c => 'A' },
            ],
        },
        {
            q => 'agency',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'books',
            a => [
                { t => 'YES, IN COMPLIANCE', c => 'A' },
                { t => 'YES, PARTIALLY or NO', c => 'B|C' },
            ],
        },
        {
            q => 'hours per week',
            a => [
                { t => 'ANY', c => '*' },
            ],
        },
        {
            q => 'length of employment',
            a => [
                { t => 'LESS THAN 30 DAYS', c => 'A' },
                { t => 'LESS THAN ONE YEAR, or ONE YEAR OR MORE', c => 'B|C' },
            ],
        },
        {
            q => 'hours per year',
            a => [
                { t => 'ANY', c => '*' },
            ],
        },
        {
            q => 'self-quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'family quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'school closed',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'stay at home',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
    ];
}

sub get_state_options {
    return [
        {
            q => 'type',
            a => [
                { t => 'ANY', c => '*' },
            ],
        },
        {
            q => 'agency',
            a => [
                { t => 'ANY', c => 'A' },
            ],
        },
        {
            q => 'books',
            a => [
                { t => 'YES (EITHER)', c => 'A|B' },
                { t => 'NO', c => 'C' },
            ],
        },
        {
            q => 'hours per week',
            a => [
                { t => 'UNDER 20', c => 'A' },
                { t => '20-29', c => 'B' },
                { t => '30-39', c => 'C' },
                { t => 'OVER 40', c => 'D' },
            ],
        },
        {
            q => 'length of employment',
            a => [
                { t => 'LESS THAN ONE YEAR', c => 'A|B' },
                { t => 'ONE YEAR OR MORE', c => 'C' },
            ],
        },
        {
            q => 'hours per year',
            a => [
                { t => 'UNDER 80', c => 'A' },
                { t => '80 OR MORE', c => 'B' },
            ],
        },
        {
            q => 'self-quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'family quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'school closed',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'stay at home',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
    ];
}

sub get_reasons_only_options {
    return [
        {
            q => 'self-quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'family quarantine',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'school closed',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'stay at home',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
    ];
}

sub usage {
    print "matrix.pl <list> <view>\n";
    print "\n";
    print "  <list> can be one of: 'federal', 'state', or 'reasons'\n";
    print "  <view> can be one of: 'options', 'codes', or 'combos'\n";
}

=pod ALL POSSIBLE ANSWERS

[type]
NANNY
HOUSE CLEANER
HOME ATTENDANT
HOME HEALTH CARE WORKER

[agency]
YES
NO

[books]
YES, IN COMPLIANCE
YES, PARTIALLY
NO

[hours per week]
UNDER 20
20-29
30-39
OVER 40

[length of employment]
LESS THAN 30 DAYS
LESS THAN ONE YEAR
ONE YEAR OR MORE

[hours per year]
UNDER 80
80 OR MORE

[self-quarantine]
YES
NO

[family quarantine]
YES
NO

[stay at home]
YES
NO

[school closed]
YES
NO

=cut

